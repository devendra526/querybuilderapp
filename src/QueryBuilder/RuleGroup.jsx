import React from 'react';
import Rule from './Rule';
import { v4 as uuidv4 } from 'uuid';
// import { Button } from '@citi-icg-9351/crisp-ui-components';

const RuleGroup = ({ ruleGroup, updateRuleGroup, parentGroup }) => {
  const handleCombinatorChange = (e, index) => {
    const updatedRules = [...ruleGroup.rules];
    updatedRules[index].combinator = e.target.value;
    updateRuleGroup({ ...ruleGroup, rules: updatedRules });
  };

  const addRule = () => {
    const newRule = {
      id: uuidv4(),
      field: '',
      operator: '=',
      value: '',
      combinator: 'and',
    };
    updateRuleGroup({
      ...ruleGroup,
      rules: [...ruleGroup.rules, newRule],
    });
  };

  const addGroup = () => {
    const newGroup = {
      id: uuidv4(),
      combinator: 'and',
      rules: [],
    };
    updateRuleGroup({
      ...ruleGroup,
      rules: [...ruleGroup.rules, newGroup],
    });
  };

  const updateRule = (index, updatedRule) => {
    const newRules = [...ruleGroup.rules];
    newRules[index] = updatedRule;
    updateRuleGroup({ ...ruleGroup, rules: newRules });
  };

  const removeRule = (index) => {
    const newRules = [...ruleGroup.rules];
    newRules.splice(index, 1);
    updateRuleGroup({ ...ruleGroup, rules: newRules });
  };

  return (
    <div className="query-group">
      <div className="query-group-header">
        <button label="+ Add Condition" onClick={addRule} >+ Add Condition</button>
        <button label="+ Add Group" onClick={addGroup} >+ Add Group</button>
        {parentGroup && (
          <button label="✖" colorValue="danger" onClick={() => parentGroup()}>✖</button>
        )}
      </div>
      <div className="query-group-children">
        {ruleGroup.rules.map((rule, index) => (
          <div key={rule.id} className="rule-container">
            {'rules' in rule ? (
              <RuleGroup
                ruleGroup={rule}
                updateRuleGroup={(newGroup) => updateRule(index, newGroup)}
                parentGroup={() => removeRule(index)}
              />
            ) : (
              <>
                <Rule
                  rule={rule}
                  updateRule={(newRule) => updateRule(index, newRule)}
                  removeRule={() => removeRule(index)}
                />
                {index < ruleGroup.rules.length - 1 && (
                  <select
                    value={rule.combinator || 'and'}
                    onChange={(e) => handleCombinatorChange(e, index)}
                  >
                    <option value="and">AND</option>
                    <option value="or">OR</option>
                  </select>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleGroup;