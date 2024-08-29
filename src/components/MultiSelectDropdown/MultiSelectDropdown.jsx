import React from 'react';
import Select, { components } from 'react-select';

const CheckboxOption = props => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null} // The checkbox itself is just for display
                    onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing on click
                />
                <label onClick={() => props.selectOption(props.data)} style={{ marginLeft: '8px' }}>
                    {props.label}
                </label>
            </components.Option>
        </div>
    );
};

const MultiSelectDropdown = ({options, title, selected, setSelected}) => {
    return (
        <Select
            options={options}
            isMulti
            closeMenuOnSelect={false}
            components={{ Option: CheckboxOption }}
            placeholder={title}
            styles={{maxWidth:'150px'}}
            value={selected}
            onChange={setSelected}
        />
    );
};

export default MultiSelectDropdown;