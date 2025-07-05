import React, { useState, useEffect } from 'react';
import RuleGroup from './RuleGroup';
import { v4 as uuidv4 } from 'uuid';
import './QueryBuilder.css';

const initialQuery = {
  id: uuidv4(),
  combinator: 'and',
  rules: []
};

const QueryBuilder = () => {
  const [query, setQuery] = useState(initialQuery);
  const [queryBuilder, setQueryBuilder] = useState('');

  useEffect(() => {
    if (query && query.rules.length > 0) {
      const whereCondition = buildWhereCondition(query);
      setQueryBuilder(whereCondition);
    } else {
      setQueryBuilder('');
    }
  }, [query]);

  const buildWhereCondition = (group) => {
    if (!group || !Array.isArray(group.rules)) return '';

    const conditions = group.rules
      .map((rule, index) => {
        let condition = '';
        if (rule.rules && Array.isArray(rule.rules)) {
          const nested = buildWhereCondition(rule);
          condition = nested ? `(${nested})` : '';
        } else if (rule.field && rule.operator && (rule.value || rule.operator.includes('null'))) {
          const valueFormatted = rule.operator.includes('null') ? '' : ` '${rule.value}'`;
          condition = `${rule.field} ${rule.operator}${valueFormatted}`;
        }

        if (!condition) return '';

        // Apply rule-specific combinator if not the first rule
        const combinator = index === 0 ? '' : ` ${rule.combinator?.toUpperCase() || group.combinator.toUpperCase()} `;
        return `${combinator}${condition}`;
      })
      .filter(Boolean)
      .join('');

    return conditions ? `${conditions}` : '';
  };

  const updateQuery = (newQuery) => {
    setQuery({ ...newQuery });
  };

  return (
    <div className="query-builder">
      <RuleGroup ruleGroup={query} updateRuleGroup={updateQuery} parentGroup={null} />
      <div className="query-output">{queryBuilder && `(${queryBuilder})`}</div>
    </div>
  );
};

export default QueryBuilder;