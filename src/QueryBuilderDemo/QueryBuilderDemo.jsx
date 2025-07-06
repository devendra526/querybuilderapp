import React, { useState } from 'react';
import './QueryBuilderDemo.css';
const fields = ['First Name', 'Last Name', 'Age', 'Country', 'City'];
const operators = ['=', '<>', 'is null', 'is not null'];

let idCounter = 1;
const getId = () => `id-${idCounter++}`;

function QueryBuilderDemo() {
    const [query, setQuery] = useState({
        id: getId(),
        combinator: 'AND',
        rules: [],
    });

    const addRule = (group) => {
        const newRule = {
            id: getId(),
            field: fields[0],
            operator: '=',
            value: '',
        };
        group.rules.push(newRule);
        setQuery({ ...query });
    };

    const addGroup = (group) => {
        const newGroup = {
            id: getId(),
            combinator: 'AND',
            rules: [],
        };
        group.rules.push(newGroup);
        setQuery({ ...query });
    };

    const removeRuleOrGroup = (parent, id) => {
        parent.rules = parent.rules.filter(r => r.id !== id);
        setQuery({ ...query });
    };

    const updateRule = (rule, key, value) => {
        rule[key] = value;
        if (key === 'operator' && (value === 'is null' || value === 'is not null')) {
            rule.value = '';
        }
        setQuery({ ...query });
    };

    const renderGroup = (group, parent = query) => (
        <div className="group" key={group.id}>
            <div className="group-header">
                <select
                    className="combinator"
                    value={group.combinator}
                    onChange={e => {
                        group.combinator = e.target.value;
                        setQuery({ ...query });
                    }}
                >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                </select>

               
            </div>

            <div className="rules-list">
                {group.rules.map(rule =>
                    rule.rules
                        ? renderGroup(rule, group)
                        : (
                            <div className="rule" key={rule.id}>
                                <select
                                    className="input-field"
                                    value={rule.field}
                                    onChange={e => updateRule(rule, 'field', e.target.value)}
                                >
                                    {fields.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <div className="operator-wrapper">
                                    <button className="operator-btn">{rule.operator}</button>
                                    <div className="operator-popup">
                                        {['=', '!=', 'is null', 'is not null'].map(op => (
                                            <div
                                                key={op}
                                                className="operator-option"
                                                onClick={() => updateRule(rule, 'operator', op)}
                                            >
                                                {op}
                                            </div>
                                        ))}
                                        <div className="arrow-down"></div>
                                    </div>
                                </div>
                                {!['is null', 'is not null'].includes(rule.operator) && (
                                    <input
                                        className="input-val"
                                        type="text"
                                        placeholder="Value"
                                        value={rule.value}
                                        onChange={e => updateRule(rule, 'value', e.target.value)}
                                    />
                                )}
                                <button className="btn btn-danger btn-sm" onClick={() => removeRuleOrGroup(group, rule.id)}>✖</button>
                            </div>
                        )
                )}
            </div>

            <div className="group-actions">
                <button className="btn btn-primary btn-sm" onClick={() => addRule(group)}>+ Condition</button>
                <button className="btn btn-secondary btn-sm" onClick={() => addGroup(group)}>+ Group</button>
            </div>
        </div>
    );

    const formatQuery = (group) => {
        if (!group.rules.length) return '';
        const parts = group.rules.map(r => {
            if (r.rules) return `(${formatQuery(r)})`;
            if (r.operator === 'is null' || r.operator === 'is not null') {
                return `${r.field} ${r.operator}`;
            }
            return `${r.field} ${r.operator} ${r.value}`;
        });
        return parts.join(` ${group.combinator} `);
    };

    return (
        <div className="App">
            <h2>React Query Builder</h2>
            {renderGroup(query)}
            <div className="output">
                <h3>Final Query:</h3>
                <pre>{formatQuery(query) || '(empty)'}</pre>
            </div>
        </div>
    );
}

export default QueryBuilderDemo;