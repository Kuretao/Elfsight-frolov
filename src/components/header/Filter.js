import { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useData } from './../providers/DataProvider';
import arrow from './../../assets/Arrow.svg';
import close from './../../assets/Close.svg';

export function Filter() {
  const {
    filters: appliedFilters,
    speciesOptions,
    applyFilters,
    resetFilters
  } = useData();

  const [localFilters, setLocalFilters] = useState(appliedFilters);

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  const onApply = (e) => {
    e.preventDefault();
    applyFilters(localFilters);
  };

  const onReset = (e) => {
    e.preventDefault();
    resetFilters();
  };

  return (
    <FiltersContainer onSubmit={onApply}>
      <CustomSelect
        label="Status"
        options={[
          { value: '', label: 'Status' },
          { value: 'Alive', label: 'Alive' },
          { value: 'Dead', label: 'Dead' },
          { value: 'unknown', label: 'Unknown' }
        ]}
        value={localFilters.status}
        onChange={(val) => setLocalFilters((f) => ({ ...f, status: val }))}
      />

      <CustomSelect
        label="Gender"
        options={[
          { value: '', label: 'Gender' },
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Genderless', label: 'Genderless' },
          { value: 'unknown', label: 'Unknown' }
        ]}
        value={localFilters.gender}
        onChange={(val) => setLocalFilters((f) => ({ ...f, gender: val }))}
      />

      <CustomSelect
        label="Species"
        options={[
          { value: '', label: 'Species' },
          ...speciesOptions.map((sp) => ({ value: sp, label: sp }))
        ]}
        value={localFilters.species}
        onChange={(val) => setLocalFilters((f) => ({ ...f, species: val }))}
      />

      <Input
        type="text"
        placeholder="Name"
        value={localFilters.name}
        onChange={(e) =>
          setLocalFilters((f) => ({ ...f, name: e.target.value }))
        }
      />

      <Input
        type="text"
        placeholder="Type"
        value={localFilters.type}
        onChange={(e) =>
          setLocalFilters((f) => ({ ...f, type: e.target.value }))
        }
      />

      <ButtonsContainer>
        <ApplyButton type="submit">Apply</ApplyButton>
        <ResetButton type="button" onClick={onReset}>
          Reset
        </ResetButton>
      </ButtonsContainer>
    </FiltersContainer>
  );
}

function CustomSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || label;

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setOpen(false);
  };

  const hasClear = value && value !== '';

  return (
    <SelectWrapper ref={ref}>
      <SelectButton
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedLabel}
        <IconsWrapper>
          {hasClear && (
            <ClearIcon onClick={handleClear} title="Clear">
              <img src={close} alt="Clear" />
            </ClearIcon>
          )}
          <Arrow open={open} hasClear={hasClear}>
            <img src={arrow} alt="Toggle dropdown" />
          </Arrow>
        </IconsWrapper>
      </SelectButton>

      {open && (
        <OptionsList role="listbox" tabIndex={-1} gap="12px">
          {options.map((opt) => (
            <Option
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              selected={opt.value === value}
            >
              {opt.label}
            </Option>
          ))}
        </OptionsList>
      )}
    </SelectWrapper>
  );
}
const greenBorder = css`
  border: 2px solid #83bf46;
  background: #263750;
  color: #b3b3b3;
  border-radius: 8px;
  font-size: 16px;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline: none;
  transition: border-color 0.2s;
  :hover {
    background: #334466;
  }
`;

const FiltersContainer = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 180px);
  gap: 10px;
  align-items: center;
  @media screen and (max-width: 950px) {
    gap: 15px;
  }
  @media screen and (max-width: 530px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  min-width: 180px;
`;

const SelectButton = styled.button`
  ${greenBorder};
  width: 100%;
`;

const OptionsList = styled.ul`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  margin: 0;
  list-style: none;
  z-index: 1000;
  scrollbar-width: thin;
`;

const Option = styled.li`
  cursor: pointer;
  padding: 8px;
  color: #1e1e1e;
  font-weight: ${({ selected }) => (selected ? '700' : '400')};
  &:hover {
    background: rgba(131, 191, 70, 0.2);
    color: #1e1e1e;
  }
`;

const Input = styled.input`
  ${greenBorder};
  min-width: 180px;
  color: #f5f5f5;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  ::placeholder {
    color: #b3b3b3;
  }

  :hover,
  :active {
    background: #334466;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;

  @media screen and (max-width: 530px) {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }
`;

const ButtonBase = css`
  font-size: 16px;
  padding: 12px;
  width: 100%;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: transparent;
  transition: background 0.2s, color 0.2s;
`;

const ApplyButton = styled.button`
  ${ButtonBase};
  color: #83bf46;
  border: 2px solid #83bf46;
  &:hover {
    background: #83bf46;
    color: #fff;
  }
`;

const ResetButton = styled.button`
  ${ButtonBase};
  color: #ff5152;
  border: 2px solid #ff5152;
  &:hover {
    background: #ff5152;
    color: #fff;
  }
`;

const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  filter: brightness(0) saturate(100%) invert(100%);
  &:hover {
    filter: none;
  }

  img {
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
`;

const Arrow = styled.span`
  display: ${({ hasClear }) => (hasClear ? 'none' : 'flex')};
  align-items: center;
  transition: transform 0.2s;
  transform: ${({ open }) => (open ? 'rotate(-180deg)' : 'rotate(0deg)')};

  img {
    width: 12px;
    height: 12px;
  }
`;
