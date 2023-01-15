import { Fragment, FunctionComponent } from 'react';
import docgenData from '../.docgen/docgen.json';

type Props = {
  of: FunctionComponent
}
export function PropsTable({of}: Props) {
  if (!of.name || !docgenData.some(entry => entry.displayName === of.name)) {
    return <Fragment/>;
  }

  const componentProps = docgenData.find(entry => entry.displayName === of.name)?.props;

  return (
    <Fragment>
      <table>
        <thead>
        <tr>
          <td>Name</td>
          <td>Type</td>
          <td>Description</td>
        </tr>
        </thead>
        <tbody>
        {Object.values(componentProps ?? {}).map(prop => (
          <tr key={prop?.name}>
            <td>{prop?.name}</td>
            <td>{prop?.type?.name}</td>
            <td>
              {prop?.description && <p>{prop.description}</p>}
              {prop?.required && <h6>Required</h6>}
              {prop?.defaultValue?.value && <h6>Default {prop.defaultValue.value}</h6>}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Fragment>
  )
}