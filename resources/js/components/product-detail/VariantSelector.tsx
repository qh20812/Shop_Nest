import React from 'react';

export interface VariantAttributeValue {
  attribute_value_id: number;
  value: string;
}

export interface VariantAttribute {
  attribute_id: number;
  name: string;
  values: VariantAttributeValue[];
}

interface VariantSelectorProps {
  attributes: VariantAttribute[];
  selected: Record<number, number>;
  onSelect: (attributeId: number, valueId: number) => void;
  isOptionAvailable: (attributeId: number, valueId: number) => boolean;
}

export default function VariantSelector({ attributes, selected, onSelect, isOptionAvailable }: VariantSelectorProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="variant-selector">
      {attributes.map((attribute) => (
        <div key={attribute.attribute_id} className="variant-group">
          <div className="variant-label">{attribute.name}</div>
          <div className="variant-options">
            {attribute.values.map((value) => {
              const isSelected = selected[attribute.attribute_id] === value.attribute_value_id;
              const available = isOptionAvailable(attribute.attribute_id, value.attribute_value_id);

              return (
                <button
                  key={value.attribute_value_id}
                  type="button"
                  className={`variant-option ${isSelected ? 'active' : ''} ${available ? '' : 'disabled'}`}
                  onClick={() => available && onSelect(attribute.attribute_id, value.attribute_value_id)}
                  disabled={!available}
                >
                  <span>{value.value}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
