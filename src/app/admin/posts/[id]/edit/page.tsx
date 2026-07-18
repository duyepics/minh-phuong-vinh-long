import { notFound } from 'next/navigation'
import { getPost } from '../../actions'
import EditPostForm from './EditPostForm'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return <EditPostForm post={post} />
}
