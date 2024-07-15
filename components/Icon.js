import * as icons from "react-bootstrap-icons"

export default Icon = ({ iconName, ...props }) => {
  const BootstrapIcon = icons[iconName]
  return (<BootstrapIcon {...props} />)
}
