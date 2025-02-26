declare module 'cornerstone-core';
declare module 'cornerstone-tools' {
  export const external: {
    cornerstone: any;
  };
  
  export function init(): void;
  export function addTool(tool: any): void;
  export function setToolActive(toolName: string, options: { mouseButtonMask: number }): void;
  export function setToolPassive(toolName: string): void;
  
  export const WwwcTool: any;
  export const ZoomTool: any;
  export const PanTool: any;
  export const LengthTool: any;
  export const MagnifyTool: any;
}

declare module 'dicom-parser'; 