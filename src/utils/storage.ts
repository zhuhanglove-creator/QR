const STORAGE_KEY = 'qr-template-studio-state-v4';

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const sanitizeSnapshot = (state: unknown) => {
  if (!isObject(state)) {
    return state;
  }

  const next = { ...state };

  delete next.assets;
  delete next.backgroundImage;
  delete next.mockupBackgroundImage;
  delete next.uploadedQrByProvider;
  delete next.validationSummary;

  if (Array.isArray(next.qrElements)) {
    next.qrElements = next.qrElements.map((item) => {
      if (!isObject(item)) {
        return item;
      }

      const qr = { ...item };
      delete qr.rawAssetId;
      delete qr.decodedText;
      delete qr.processingResult;
      return qr;
    });
  }

  if (isObject(next.character) && 'src' in next.character) {
    next.character = {
      ...next.character,
      src: undefined,
    };
  }

  return next;
};

export const saveEditorSnapshot = (state: unknown) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeSnapshot(state)));
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }
};

export const loadEditorSnapshot = <T>() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage cleanup failures
    }
    return null;
  }
};
