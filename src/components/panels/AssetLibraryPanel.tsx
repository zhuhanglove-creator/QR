import { ImagePlus, QrCode, UserRound, Wallpaper } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useDropzone } from 'react-dropzone';
import { useEditorStore } from '../../store/editorStore';
import { readFileAsDataUrl } from '../../utils/image';
import { Panel } from '../common/Panel';

export const AssetLibraryPanel = () => {
  const assets = useEditorStore((state) => state.assets);
  const addImageAsset = useEditorStore((state) => state.addImageAsset);
  const attachBackgroundAsset = useEditorStore((state) => state.attachBackgroundAsset);
  const attachMockupBackgroundAsset = useEditorStore((state) => state.attachMockupBackgroundAsset);
  const attachCharacterAsset = useEditorStore((state) => state.attachCharacterAsset);
  const processQrUpload = useEditorStore((state) => state.processQrUpload);

  const makeAsset = async (file: File, kind: 'background' | 'mockup' | 'character') => {
    const src = await readFileAsDataUrl(file);
    const asset = {
      id: nanoid(),
      name: file.name,
      kind,
      mimeType: file.type,
      src,
      createdAt: new Date().toISOString(),
    } as const;
    addImageAsset(asset);
    return asset;
  };

  const backgroundDropzone = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const asset = await makeAsset(file, 'background');
      attachBackgroundAsset(asset.id);
    },
  });

  const mockupDropzone = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const asset = await makeAsset(file, 'mockup');
      attachMockupBackgroundAsset(asset.id);
    },
  });

  const characterDropzone = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const asset = await makeAsset(file, 'character');
      attachCharacterAsset(asset.id);
    },
  });

  const wechatDropzone = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) await processQrUpload(file, 'wechat');
    },
  });

  const alipayDropzone = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) await processQrUpload(file, 'alipay');
    },
  });

  return (
    <Panel title="2. 上传图片" className="max-h-[calc(100vh-170px)] overflow-y-auto">
      <div className="grid gap-4">
        <div className="rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#f7fbff,#fff7fb)] p-4">
          <div className="text-sm font-semibold text-slate-800">上传区已经单独放到一个面板</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">不用再从模板库一路往下滑。切到“上传图片”就能直接上传二维码、卡片背景、场景背景和角色图。</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div {...wechatDropzone.getRootProps()} className="rounded-[24px] border border-dashed border-emerald-300 bg-emerald-50/90 p-4 text-sm text-emerald-900">
            <input {...wechatDropzone.getInputProps()} />
            <QrCode className="mb-2 h-5 w-5" />
            <div className="font-semibold">上传微信收款码</div>
            <p className="mt-1 text-xs leading-5 text-emerald-700">默认优先走双码。只上传一个时，会自动切到单码模板。</p>
          </div>

          <div {...alipayDropzone.getRootProps()} className="rounded-[24px] border border-dashed border-sky-300 bg-sky-50/90 p-4 text-sm text-sky-900">
            <input {...alipayDropzone.getInputProps()} />
            <QrCode className="mb-2 h-5 w-5" />
            <div className="font-semibold">上传支付宝收款码</div>
            <p className="mt-1 text-xs leading-5 text-sky-700">支持 PNG、JPG、WEBP、GIF，上传后会自动识别并替换到模板里。</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div {...backgroundDropzone.getRootProps()} className="rounded-[24px] border border-dashed border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-900">
            <input {...backgroundDropzone.getInputProps()} />
            <Wallpaper className="mb-2 h-5 w-5" />
            <div className="font-semibold">卡片内部背景</div>
            <p className="mt-1 text-xs leading-5 text-rose-700">改的是卡片本体里面的底图、底纹和氛围层，不是外面的场景背景。</p>
          </div>

          <div {...mockupDropzone.getRootProps()} className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/80 p-4 text-sm text-violet-900">
            <input {...mockupDropzone.getInputProps()} />
            <ImagePlus className="mb-2 h-5 w-5" />
            <div className="font-semibold">外部场景背景</div>
            <p className="mt-1 text-xs leading-5 text-violet-700">改的是卡片外侧的 mockup 场景，比如桌面、布料、拍摄背景。</p>
          </div>

          <div {...characterDropzone.getRootProps()} className="rounded-[24px] border border-dashed border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
            <input {...characterDropzone.getInputProps()} />
            <UserRound className="mb-2 h-5 w-5" />
            <div className="font-semibold">替换角色插画</div>
            <p className="mt-1 text-xs leading-5 text-amber-700">把模板里的原创占位角色换成你自己的插画或人物图。</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ImagePlus className="h-4 w-4" />
            最近上传
          </div>

          <div className="grid gap-2">
            {assets.length === 0 && <p className="text-xs text-slate-500">上传二维码、背景或角色后，这里会保留最近素材，方便重复套用。</p>}

            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-2">
                <img src={asset.src} alt={asset.name} className="h-12 w-12 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-800">{asset.name}</div>
                  <div className="text-xs text-slate-500">{asset.kind}</div>
                </div>
                {asset.kind === 'background' && (
                  <button type="button" className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white" onClick={() => attachBackgroundAsset(asset.id)}>
                    卡片背景
                  </button>
                )}
                {asset.kind === 'mockup' && (
                  <button type="button" className="rounded-full bg-rose-500 px-3 py-1 text-xs text-white" onClick={() => attachMockupBackgroundAsset(asset.id)}>
                    场景背景
                  </button>
                )}
                {asset.kind === 'character' && (
                  <button type="button" className="rounded-full bg-amber-500 px-3 py-1 text-xs text-white" onClick={() => attachCharacterAsset(asset.id)}>
                    角色图
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
};
