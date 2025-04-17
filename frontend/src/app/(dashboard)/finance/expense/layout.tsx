import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finance Expense Management | Xela',
  description: 'Manage your expenses, transactions, and financial calendar with detailed analytics and reporting.',
  keywords: 'finance, expense, transaction, budget, financial management',
  openGraph: {
    title: 'Finance Expense Management | Xela',
    description: 'Manage your expenses, transactions, and financial calendar with detailed analytics and reporting.',
    type: 'website',
  },
};

export default function ExpenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      {children}
    </section>
  );
} 