/**
 * Representasi satu aturan komunitas beserta deskripsinya.
 */
export interface CommunityRuleItem {
  id: number;
  title: string;
  description: string;
}

/**
 * Properti untuk komponen daftar aturan komunitas bergaya akordeon.
 */
export interface CommunityRulesListProps {
  rules: CommunityRuleItem[];
  className?: string;
}
