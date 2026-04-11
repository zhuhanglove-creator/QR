import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text } from 'react-konva';
import type Konva from 'konva';
import { useImageElement } from '../../hooks/useImageElement';
import { renderQrDataUrl } from '../../modules/qr-processing/renderer';
import { useEditorStore } from '../../store/editorStore';
import type { DecorationElement, QrElement } from '../../types';
import { createCharacterSvg, createPatternSvg, createStickerSvg } from '../../utils/templateArt';

const sceneBackground = (scene: string, colors: string[]) => {
  switch (scene) {
    case 'fabric':
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 48%, ${colors[2]})`;
    case 'desk':
      return `linear-gradient(160deg, ${colors[1]}, ${colors[0]} 55%, ${colors[2]})`;
    case 'sparkle':
      return `radial-gradient(circle at 20% 20%, ${colors[2]}, transparent 24%), linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
    case 'studio':
      return `radial-gradient(circle at 50% 20%, ${colors[0]}, ${colors[1]} 62%, ${colors[2]})`;
    default:
      return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  }
};

const QrFrame = ({ qr, image }: { qr: QrElement; image?: HTMLImageElement }) => {
  const frameX = qr.x - 26;
  const frameY = qr.y - 34;
  const frameWidth = qr.width + 52;
  const frameHeight = qr.height + 126;
  const accent = qr.accentColor;
  const hasDescription = Boolean(qr.description?.trim());

  return (
    <Group>
      <Rect
        x={frameX}
        y={frameY}
        width={frameWidth}
        height={frameHeight}
        fill="#ffffff"
        cornerRadius={34}
        stroke={qr.frameTheme === 'glow' ? accent : `${accent}66`}
        strokeWidth={qr.frameTheme === 'sticker' ? 14 : 3}
        shadowColor={accent}
        shadowBlur={qr.frameTheme === 'glow' ? 36 : 18}
        shadowOpacity={qr.frameTheme === 'glow' ? 0.28 : 0.14}
        shadowOffsetY={10}
      />
      <Rect
        x={frameX + 12}
        y={frameY + 12}
        width={frameWidth - 24}
        height={frameHeight - 24}
        fill={qr.frameTheme === 'cloud' ? '#f7fbff' : '#fffdfd'}
        cornerRadius={28}
        stroke={`${accent}33`}
        strokeWidth={2}
      />
      <Rect x={qr.x} y={qr.y} width={qr.width} height={qr.height} fill="#ffffff" cornerRadius={24} stroke={`${accent}30`} strokeWidth={1.5} />
      {image ? (
        <KonvaImage x={qr.x + 10} y={qr.y + 10} width={qr.width - 20} height={qr.height - 20} image={image} cornerRadius={18} />
      ) : (
        <>
          <Rect x={qr.x + 10} y={qr.y + 10} width={qr.width - 20} height={qr.height - 20} fill="#ffffff" dash={[10, 8]} stroke={`${accent}80`} cornerRadius={18} />
          <Text x={qr.x + 28} y={qr.y + qr.height / 2 - 12} width={qr.width - 56} text="上传二维码后自动生成" align="center" fontSize={18} fill="#7b8195" />
        </>
      )}

      {(qr.badgeText ?? '').trim() && (
        <>
          <Rect x={frameX + 24} y={frameY + 22} width={110} height={36} fill={accent} cornerRadius={999} />
          <Text x={frameX + 24} y={frameY + 32} width={110} text={qr.badgeText ?? ''} align="center" fontSize={14} fontStyle="700" fill="#ffffff" />
        </>
      )}
      <Text x={frameX + 20} y={qr.y + qr.height + 32} width={frameWidth - 40} text={qr.platformName} align="center" fontSize={24} fontStyle="700" fill="#4b5563" />
      {hasDescription && <Text x={frameX + 20} y={qr.y + qr.height + 64} width={frameWidth - 40} text={qr.description ?? ''} align="center" fontSize={16} fill="#8b90a4" />}
    </Group>
  );
};

const QrNode = ({ qr }: { qr: QrElement }) => {
  const qrImage = useImageElement(
    qr.processingResult?.moduleMatrix ? renderQrDataUrl(qr.processingResult.moduleMatrix, qr.style, 768) : undefined,
  );

  return <QrFrame qr={qr} image={qrImage} />;
};

const StickerNode = ({ element, scale }: { element: DecorationElement; scale: number }) => {
  const src = createStickerSvg({
    ...element,
    width: element.width * scale,
    height: element.height * scale,
  });
  const image = useImageElement(src);

  if (!image || !element.visible) {
    return null;
  }

  return <KonvaImage x={element.x} y={element.y} width={element.width * scale} height={element.height * scale} image={image} opacity={element.opacity} rotation={element.rotation} />;
};

interface CanvasWorkspaceProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export const CanvasWorkspace = ({ stageRef }: CanvasWorkspaceProps) => {
  const canvas = useEditorStore((state) => state.canvas);
  const mockup = useEditorStore((state) => state.mockup);
  const previewMode = useEditorStore((state) => state.previewMode);
  const textElements = useEditorStore((state) => state.textElements);
  const qrElements = useEditorStore((state) => state.qrElements);
  const decorations = useEditorStore((state) => state.decorations);
  const character = useEditorStore((state) => state.character);
  const activeTemplateId = useEditorStore((state) => state.activeTemplateId);
  const templates = useEditorStore((state) => state.templates);
  const backgroundImage = useEditorStore((state) => state.backgroundImage);
  const mockupBackgroundImage = useEditorStore((state) => state.mockupBackgroundImage);
  const showDecorations = useEditorStore((state) => state.showDecorations);
  const showCharacter = useEditorStore((state) => state.showCharacter);
  const decorationScale = useEditorStore((state) => state.decorationScale);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      setViewportSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const template = useMemo(() => templates.find((item) => item.id === activeTemplateId), [activeTemplateId, templates]);
  const cardPattern = useMemo(() => (template ? createPatternSvg(canvas.backgroundPattern, template.palette, canvas.width, canvas.height) : undefined), [canvas.backgroundPattern, canvas.height, canvas.width, template]);
  const sortedDecorations = useMemo(() => [...decorations].sort((a, b) => a.zIndex - b.zIndex), [decorations]);
  const patternImage = useImageElement(cardPattern);
  const cardBackground = useImageElement(backgroundImage);
  const mockupBackground = useImageElement(mockupBackgroundImage);
  const characterImage = useImageElement(character?.src ?? (character && template ? createCharacterSvg(character, template.palette) : undefined));

  const sceneWrapperStyle =
    previewMode === 'mockup'
      ? sceneBackground(mockup.scene, mockup.sceneColors)
      : 'linear-gradient(135deg, #fff8fb, #eef5ff 55%, #f9f2ff)';

  const availableWidth = Math.max(viewportSize.width - 24, 320);
  const availableHeight = Math.max(viewportSize.height - 24, 320);
  const stageScale = viewportSize.width === 0 || viewportSize.height === 0 ? 1 : Math.min(availableWidth / canvas.sceneWidth, availableHeight / canvas.sceneHeight, 1);
  const scaledWidth = canvas.sceneWidth * stageScale;
  const scaledHeight = canvas.sceneHeight * stageScale;

  return (
    <div className="rounded-[36px] border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">实时卡片预览</h2>
          <p className="text-sm text-slate-500">画布会自动缩放到当前区域，尽量让你不需要手动拖动画面。</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          卡片 {canvas.width} × {canvas.height} / 场景 {canvas.sceneWidth} × {canvas.sceneHeight}
        </div>
      </div>

      <div ref={viewportRef} className="rounded-[30px] p-4" style={{ background: sceneWrapperStyle, minHeight: 'calc(100vh - 240px)' }}>
        <div className="flex h-full min-h-[520px] items-center justify-center overflow-hidden">
          <div style={{ width: scaledWidth, height: scaledHeight }}>
            <Stage
              ref={stageRef}
              width={canvas.sceneWidth}
              height={canvas.sceneHeight}
              scaleX={stageScale}
              scaleY={stageScale}
              className="rounded-[32px]"
            >
              <Layer>
                <Rect width={canvas.sceneWidth} height={canvas.sceneHeight} fill="rgba(255,255,255,0)" />

                {previewMode === 'mockup' && (
                  <>
                    <Rect width={canvas.sceneWidth} height={canvas.sceneHeight} fillLinearGradientStartPoint={{ x: 0, y: 0 }} fillLinearGradientEndPoint={{ x: canvas.sceneWidth, y: canvas.sceneHeight }} fillLinearGradientColorStops={[0, mockup.sceneColors[0], 0.5, mockup.sceneColors[1], 1, mockup.sceneColors[2]]} />
                    {mockupBackground && <KonvaImage x={0} y={0} width={canvas.sceneWidth} height={canvas.sceneHeight} image={mockupBackground} opacity={0.32} />}
                  </>
                )}

                {previewMode === 'mockup' && mockup.stickerScatter && showDecorations && decorations.length >= 3 && (
                  <>
                    <StickerNode element={{ ...decorations[0], x: 110, y: 60, width: 130, height: 96 }} scale={0.9} />
                    <StickerNode element={{ ...decorations[1], x: canvas.sceneWidth - 230, y: 120, width: 92, height: 92 }} scale={0.9} />
                    <StickerNode element={{ ...decorations[2], x: 1460, y: 980, width: 92, height: 84 }} scale={0.9} />
                  </>
                )}

                <Group x={canvas.cardX} y={canvas.cardY} rotation={previewMode === 'mockup' ? mockup.rotation : 0}>
                  <Rect
                    width={canvas.width}
                    height={canvas.height}
                    fill={canvas.backgroundColor}
                    cornerRadius={canvas.borderRadius}
                    shadowColor="#6d4d75"
                    shadowBlur={previewMode === 'mockup' ? 50 : 28}
                    shadowOpacity={previewMode === 'mockup' ? 0.24 : 0.12}
                    shadowOffsetY={previewMode === 'mockup' ? 20 : 12}
                  />
                  <Rect
                    width={canvas.width}
                    height={canvas.height}
                    cornerRadius={canvas.borderRadius}
                    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                    fillLinearGradientEndPoint={{ x: canvas.width, y: canvas.height }}
                    fillLinearGradientColorStops={[0, canvas.backgroundGradientFrom ?? canvas.backgroundColor, 1, canvas.backgroundGradientTo ?? canvas.backgroundColor]}
                  />

                  {cardBackground && <KonvaImage x={0} y={0} width={canvas.width} height={canvas.height} image={cardBackground} opacity={canvas.backgroundImageOpacity ?? 0.35} />}
                  {patternImage && <KonvaImage x={0} y={0} width={canvas.width} height={canvas.height} image={patternImage} opacity={0.75} />}

                  <Rect x={16} y={16} width={canvas.width - 32} height={canvas.height - 32} cornerRadius={canvas.borderRadius - 14} stroke={template?.palette.line ?? '#e9b0cc'} strokeWidth={2} opacity={0.7} />

                  {showDecorations && sortedDecorations.map((element) => <StickerNode key={element.id} element={element} scale={decorationScale} />)}

                  {showCharacter && character && character.place === 'behind' && characterImage && <KonvaImage x={character.x} y={character.y} width={character.width} height={character.height} image={characterImage} opacity={character.opacity} />}

                  {textElements.map((element) =>
                    element.kind === 'footer' && !element.text.trim() ? null : (
                      <Text key={element.id} x={element.x} y={element.y} width={element.width} text={element.text} align={element.align} fontFamily={element.fontFamily} fontSize={element.fontSize} fontStyle={String(element.fontWeight)} fill={element.color} />
                    ),
                  )}

                  {qrElements.map((qr) => (
                    <QrNode key={qr.id} qr={qr} />
                  ))}

                  {showCharacter && character && character.place === 'front' && characterImage && <KonvaImage x={character.x} y={character.y} width={character.width} height={character.height} image={characterImage} opacity={character.opacity} />}
                </Group>
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
};
