export const RiskColorMap: Record<
  RiskLevel,
  {
    backgroundColor: string;
    indicatorColor: string;
  }
> = {
  '5': {
    backgroundColor: '#d416057a',
    indicatorColor: '#D41505',
  },
  '4': {
    backgroundColor: '#fb8b357a',
    indicatorColor: '#FB8C35',
  },
  '3': {
    backgroundColor: '#ffee6e82',
    indicatorColor: '#FFED6E',
  },
  '2': {
    backgroundColor: '#65a4bd77',
    indicatorColor: '#65A4BD',
  },
  '1': {
    backgroundColor: '#4575b480',
    indicatorColor: '#4575B4',
  },
};

const RISK_LEVELS: readonly RiskLevel[] = ['1', '2', '3', '4', '5'];

export function isRiskLevel(value: string): value is RiskLevel {
  return (RISK_LEVELS as readonly string[]).includes(value);
}
