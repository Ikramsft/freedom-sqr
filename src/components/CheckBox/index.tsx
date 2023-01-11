/**
 * @format
 */
import React from 'react';
import {Checkbox as NBCheckbox, MinusIcon, CheckIcon} from 'native-base';
import {ICheckboxProps} from 'native-base/lib/typescript/components/primitives/Checkbox/types';

interface Props extends ICheckboxProps {
  indeterminate?: boolean;
}

function Checkbox(props: Props) {
  const {indeterminate = false, isChecked, children, ...rest} = props;

  const Icon = indeterminate ? <MinusIcon /> : <CheckIcon />;

  return (
    <NBCheckbox
      colorScheme="brand"
      icon={Icon}
      key={`reload-${indeterminate}-${isChecked}`}
      {...rest}
      isChecked={indeterminate || isChecked}>
      {children}
    </NBCheckbox>
  );
}

Checkbox.defaultProps = {
  indeterminate: false,
};

export {Checkbox};
