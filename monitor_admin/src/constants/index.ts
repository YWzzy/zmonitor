export enum AppType {
  WEB = 1,
  WXMIN = 2,
}

export const AppTypes = [
  {
    label: 'web',
    value: AppType.WEB,
  },
  {
    label: '微信小程序',
    value: AppType.WXMIN,
  },
];

export enum ProjectEnvType {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  LOCALDEV = 'localdev',
  TEST = 'test',
}

export const ProjectEnvTypes = [
  {
    label: 'dev',
    value: ProjectEnvType.DEVELOPMENT,
  },
  {
    label: 'prod',
    value: ProjectEnvType.PRODUCTION,
  },
  {
    label: 'local',
    value: ProjectEnvType.LOCALDEV,
  },
  {
    label: 'test',
    value: ProjectEnvType.TEST,
  },
];
