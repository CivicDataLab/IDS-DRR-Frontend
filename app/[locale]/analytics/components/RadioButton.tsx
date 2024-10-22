import React from 'react';

import './RadioButton.scss';

import { Text } from 'opub-ui';

const RadioButton = (props: any) => {
  return (
    <div className="RadioButton">
      <input
        onChange={(e) => {
          props.changed(e.target.value);
        }}
        value={props.value}
        type="radio"
        id={props.id}
        checked={props.isSelected}
        aria-checked={props.isSelected}
      />
      <label aria-label={props.label} htmlFor={props.id} title={props.label}>
        <Text>{props.label}</Text>
      </label>
    </div>
  );
};

export default RadioButton;
