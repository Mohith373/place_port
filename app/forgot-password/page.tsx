import ForgotForm from '@/components/ForgotForm'

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <ForgotForm linkExpired={error === 'link'} />
}