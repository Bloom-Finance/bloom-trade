import withPreCheckStore from '../../controls/preCheckApiKey'

export interface IBloomReactProps {
  credentials: string
  useTestnet?: boolean
  children: JSX.Element
}

const BloomReact = (props: IBloomReactProps): JSX.Element => {
  return props.children
}

export default withPreCheckStore(BloomReact)
