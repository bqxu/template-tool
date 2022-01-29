import react, { useState } from 'react'
import './index.less'
export default function Index() {
  const [data, setData] = useState<Record<string, any>>({})
  return <div class='page-index'>index</div>
}
