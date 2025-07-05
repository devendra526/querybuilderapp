import React, { useState, useEffect } from 'react';
// import { Button } from '@citi-icg-9351/crisp-ui-components';

const fields = [
  { name: 'FirstName', label: 'First Name' },
  { name: 'LastName', label: 'Last Name' },
  { name: 'Age', label: 'Age' },
  { name: 'Country', label: 'Country' },
];

const operatorOptions = ['=', '<>', 'is null', 'is not null'];

const Rule = ({ rule, updateRule, removeRule }) => {
  const [tempRule, setTempRule] = useState(rule);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    updateRule(tempRule);
  }, [tempRule]);

  const handleChange = (field, value) => {
    setTempRule({ ...tempRule, [field]: value });
  };

  const handleOperatorChange = (operator) => {
    setTempRule({ ...tempRule, operator });
    setShowPopup(false);
  };

  return (
    <div className="query-rule">
      <select
        value={tempRule.field}
        onChange={(e) => handleChange('field', e.target.value)}
      >
        <option value="">Field</option>
        {fields.map((f) => (
          <option key={f.name} value={f.name}>
            {f.label}
          </option>
        ))}
      </select>

      <div
        className="operator-popup-wrapper"
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <button className="operator-button">{tempRule.operator || '='}</button>
        {showPopup && (
          <div className="operator-popup">
            {operatorOptions.map((op) => (
              <button
                key={op}
                className="popup-btn"
                onClick={() => handleOperatorChange(op)}
              >
                {op}
              </button>
            ))}
          </div>
        )}
      </div>

      {tempRule.operator !== 'is null' &&
        tempRule.operator !== 'is not null' && (
          <input
            type="text"
            value={tempRule.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder="value"
          />
        )}

      <button
        
        onClick={() => updateRule(tempRule)}
      > Ok</button>
      <button
        onClick={removeRule}
      >Del</button>
    </div>
  );
};

export default Rule;