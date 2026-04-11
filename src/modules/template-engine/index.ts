import type { Template } from '../../types';

export const cloneTemplate = <T>(value: T): T => structuredClone(value);

export const applyTemplateToProject = (template: Template) => ({
  activeTemplateId: template.id,
  canvas: cloneTemplate(template.canvas),
  mockup: cloneTemplate(template.mockup),
  textElements: cloneTemplate(template.textElements),
  qrElements: cloneTemplate(template.qrElements),
  decorations: cloneTemplate(template.decorations),
  character: cloneTemplate(template.character),
  exportConfig: cloneTemplate(template.defaultExportConfig),
});
