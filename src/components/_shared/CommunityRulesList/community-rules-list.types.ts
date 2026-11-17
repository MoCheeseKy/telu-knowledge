export interface CommunityRuleItem {
  id: number;
  title: string;
  description: string;
}

export interface CommunityRulesListProps {
  rules: CommunityRuleItem[];
  className?: string;
}
