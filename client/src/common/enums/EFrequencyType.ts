export enum EFrequencyType {
  Once = 0,
  Annually = 1,
  SemiAnnually = 6,
  Monthly = 12,
  BiWeekly = 26,
  Weekly = 52,
}

export const EFrequencyValues = [
  { text: 'Once', value: EFrequencyType.Once },
  { text: 'Annually', value: EFrequencyType.Annually },
  { text: 'Semi-Annually', value: EFrequencyType.SemiAnnually },
  { text: 'Monthly', value: EFrequencyType.Monthly },
  { text: 'Biweekly', value: EFrequencyType.BiWeekly },
  { text: 'Weekly', value: EFrequencyType.Weekly },
]
