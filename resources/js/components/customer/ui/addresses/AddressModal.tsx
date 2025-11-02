import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AddressFormData, AdministrativeOption, CountryOption, DivisionStructure } from './types';

export type AddressModalProps = {
  isOpen: boolean;
  title: string;
  formData: AddressFormData;
  errors: Partial<Record<keyof AddressFormData | 'general', string>>;
  loading?: boolean;
  onChange: <K extends keyof AddressFormData>(field: K, value: AddressFormData[K]) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  title,
  formData,
  errors,
  loading = false,
  onChange,
  onSubmit,
  onClose,
}) => {
  type OptionKey = 'countries' | 'provinces' | 'districts' | 'wards';

  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [divisionStructure, setDivisionStructure] = useState<DivisionStructure | null>(null);
  const [provinceOptions, setProvinceOptions] = useState<AdministrativeOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<AdministrativeOption[]>([]);
  const [wardOptions, setWardOptions] = useState<AdministrativeOption[]>([]);
  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState<{ province: boolean; district: boolean; ward: boolean }>(
    { province: false, district: false, ward: false }
  );
  const [optionsLoading, setOptionsLoading] = useState<Record<OptionKey, boolean>>({
    countries: false,
    provinces: false,
    districts: false,
    wards: false,
  });
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const normalizeOptions = (payload: unknown): AdministrativeOption[] => {
    if (Array.isArray(payload)) {
      return payload as AdministrativeOption[];
    }

    if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: AdministrativeOption[] }).data)) {
      return (payload as { data: AdministrativeOption[] }).data;
    }

    return [];
  };

  const loadOptions = useCallback(async (key: OptionKey, url: string) => {
    setOptionsLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(url, {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load ${key}: ${response.status}`);
      }

      const payload = await response.json();

      return normalizeOptions(payload);
    } finally {
      setOptionsLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCountryOptions([]);
      setDivisionStructure(null);
      setProvinceOptions([]);
      setDistrictOptions([]);
      setWardOptions([]);
      setOptionsError(null);
      return;
    }

    let active = true;
    setOptionsError(null);

    const fetchCountries = async () => {
      try {
        const countries = await loadOptions('countries', route('user.addresses.countries'));

        if (!active) {
          return;
        }

        setCountryOptions(countries as CountryOption[]);
      } catch (error) {
        console.error(error);
        if (active) {
          setCountryOptions([]);
          setOptionsError('Không thể tải dữ liệu quốc gia. Vui lòng thử lại.');
        }
      }
    };

    void fetchCountries();

    return () => {
      active = false;
    };
  }, [isOpen, loadOptions]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!formData.country_id) {
      setDivisionStructure(null);
      setProvinceOptions([]);
      setDistrictOptions([]);
      setWardOptions([]);
      return;
    }

    let active = true;
    setOptionsError(null);
    setDivisionStructure(null);
    setProvinceOptions([]);
    setDistrictOptions([]);
    setWardOptions([]);

    // Set division structure based on selected country
    const selectedCountry = countryOptions.find(c => c.id === formData.country_id);
    if (selectedCountry) {
      // For now, hardcode division structures. In future, fetch from API
      if (selectedCountry.iso_code_2 === 'VN') {
        setDivisionStructure({
          levels: ['province', 'commune'],
          labels: { vi: ['Tỉnh', 'Xã/Phường'], en: ['Province', 'Commune'] }
        });
      } else if (selectedCountry.iso_code_2 === 'US') {
        setDivisionStructure({
          levels: ['state', 'county', 'city'],
          labels: { en: ['State', 'County', 'City'] }
        });
      }
    }

    const fetchProvinces = async () => {
      try {
        const provinces = await loadOptions('provinces', route('user.addresses.provinces', formData.country_id));

        if (!active) {
          return;
        }

        setProvinceOptions(provinces);
      } catch (error) {
        console.error(error);
        if (active) {
          setProvinceOptions([]);
          setOptionsError('Không thể tải dữ liệu địa lý. Vui lòng thử lại.');
        }
      }
    };

    void fetchProvinces();

    return () => {
      active = false;
    };
  }, [isOpen, formData.country_id, countryOptions, loadOptions]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!formData.province_id) {
      setDistrictOptions([]);
      setWardOptions([]);
      return;
    }

    let active = true;
    setOptionsError(null);
    setDistrictOptions([]);
    setWardOptions([]);

    const fetchDistricts = async () => {
      try {
        const districts = await loadOptions('districts', route('user.addresses.districts', formData.province_id));

        if (!active) {
          return;
        }

        setDistrictOptions(districts);
      } catch (error) {
        console.error(error);
        if (active) {
          setDistrictOptions([]);
          setOptionsError('Không thể tải dữ liệu địa lý. Vui lòng thử lại.');
        }
      }
    };

    void fetchDistricts();

    return () => {
      active = false;
    };
  }, [isOpen, formData.province_id, loadOptions]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!formData.district_id) {
      setWardOptions([]);
      return;
    }

    let active = true;
    setOptionsError(null);
    setWardOptions([]);

    const fetchWards = async () => {
      try {
        const wards = await loadOptions('wards', route('user.addresses.wards', formData.district_id));

        if (!active) {
          return;
        }

        setWardOptions(wards);
      } catch (error) {
        console.error(error);
        if (active) {
          setWardOptions([]);
          setOptionsError('Không thể tải dữ liệu địa lý. Vui lòng thử lại.');
        }
      }
    };

    void fetchWards();

    return () => {
      active = false;
    };
  }, [isOpen, formData.district_id, loadOptions]);

  const selectedProvince = useMemo(() => {
    if (!formData.province_id) {
      return undefined;
    }
    return provinceOptions.find((option) => option.id === Number(formData.province_id));
  }, [formData.province_id, provinceOptions]);

  const selectedDistrict = useMemo(() => {
    if (!formData.district_id) {
      return undefined;
    }
    return districtOptions.find((option) => option.id === Number(formData.district_id));
  }, [formData.district_id, districtOptions]);

  const selectedWard = useMemo(() => {
    if (!formData.ward_id) {
      return undefined;
    }
    return wardOptions.find((option) => option.id === Number(formData.ward_id));
  }, [formData.ward_id, wardOptions]);

  useEffect(() => {
    if (!isOpen) {
      setProvinceSearch('');
      setDistrictSearch('');
      setWardSearch('');
      setDropdownOpen({ province: false, district: false, ward: false });
      return;
    }

    if (!formData.country_id) {
      setProvinceSearch('');
      setDistrictSearch('');
      setWardSearch('');
      setDropdownOpen({ province: false, district: false, ward: false });
    }
  }, [isOpen, formData.country_id]);

  useEffect(() => {
    if (!formData.province_id) {
      setDistrictSearch('');
      setWardSearch('');
    }
  }, [formData.province_id]);

  useEffect(() => {
    if (!formData.district_id) {
      setWardSearch('');
    }
  }, [formData.district_id]);

  useEffect(() => {
    if (selectedProvince) {
      setProvinceSearch('');
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setDistrictSearch('');
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedWard) {
      setWardSearch('');
    }
  }, [selectedWard]);

  const filteredProvinces = useMemo(() => {
    const term = provinceSearch.trim().toLowerCase();
    if (!term) {
      return provinceOptions;
    }
    return provinceOptions.filter((option) => option.name.toLowerCase().includes(term));
  }, [provinceOptions, provinceSearch]);

  const filteredDistricts = useMemo(() => {
    const term = districtSearch.trim().toLowerCase();
    if (!term) {
      return districtOptions;
    }
    return districtOptions.filter((option) => option.name.toLowerCase().includes(term));
  }, [districtOptions, districtSearch]);

  const filteredWards = useMemo(() => {
    const term = wardSearch.trim().toLowerCase();
    if (!term) {
      return wardOptions;
    }
    return wardOptions.filter((option) => option.name.toLowerCase().includes(term));
  }, [wardOptions, wardSearch]);

  const provinceInputValue = provinceSearch !== '' ? provinceSearch : (selectedProvince?.name ?? '');
  const districtInputValue = districtSearch !== '' ? districtSearch : (selectedDistrict?.name ?? '');
  const wardInputValue = wardSearch !== '' ? wardSearch : (selectedWard?.name ?? '');

  const handleCountrySelection = (value: number | '') => {
    onChange('country_id', value);
    onChange('province_id', '');
    onChange('district_id', '');
    onChange('ward_id', '');
  };

  const handleProvinceSelection = (value: number | '') => {
    onChange('province_id', value);
    onChange('district_id', '');
    onChange('ward_id', '');
  };

  const handleDistrictSelection = (value: number | '') => {
    onChange('district_id', value);
    onChange('ward_id', '');
  };

  const handleWardSelection = (value: number | '') => {
    onChange('ward_id', value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loading) {
      onSubmit();
    }
  };

  const getDivisionLabel = (levelIndex: number, fallback: string) => {
    if (!divisionStructure) return fallback;
    const labels = divisionStructure.labels.vi || divisionStructure.labels.en || [];
    return labels[levelIndex] || fallback;
  };

  const countryDisabled = optionsLoading.countries && countryOptions.length === 0;
  const provinceDisabled = !formData.country_id || (optionsLoading.provinces && provinceOptions.length === 0);
  const districtDisabled = !formData.province_id || (optionsLoading.districts && districtOptions.length === 0);
  const wardDisabled = !formData.district_id || (optionsLoading.wards && wardOptions.length === 0);

  return (
    <div className={`address-modal${isOpen ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
      <div className="address-modal__content">
        <header className="address-modal__header">
          <h2 id="address-modal-title" className="address-modal__title">
            {title}
          </h2>
          <button type="button" className="address-action-btn" aria-label="Đóng" onClick={onClose}>
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </header>
        <div className="address-modal__body">
          <form id="address-form" className="address-form" onSubmit={handleSubmit}>
            <div className="address-form-field">
              <label className="address-form-label" htmlFor="country-select">
                Quốc gia
              </label>
              <select
                id="country-select"
                className="address-form-select"
                value={formData.country_id}
                onChange={(event) => handleCountrySelection(event.target.value ? Number(event.target.value) : '')}
                required
                disabled={countryDisabled}
                aria-busy={optionsLoading.countries}
              >
                <option value="" disabled>
                  {optionsLoading.countries ? 'Đang tải...' : 'Chọn Quốc gia'}
                </option>
                {countryOptions.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country_id && <span className="address-form-error">{errors.country_id}</span>}
            </div>
            <div className="address-form-field">
              <label className="address-form-label" htmlFor="recipient-input">
                Người nhận
              </label>
              <input
                id="recipient-input"
                className="address-form-input"
                type="text"
                value={formData.recipient_name}
                onChange={(event) => onChange('recipient_name', event.target.value)}
                placeholder="Họ và tên"
                required
              />
              {errors.recipient_name && <span className="address-form-error">{errors.recipient_name}</span>}
            </div>
            <div className="address-form-field">
              <label className="address-form-label" htmlFor="phone-input">
                Số điện thoại
              </label>
              <input
                id="phone-input"
                className="address-form-input"
                type="tel"
                value={formData.phone}
                onChange={(event) => onChange('phone', event.target.value)}
                placeholder="Ví dụ: 0901 234 567"
                required
              />
              {errors.phone && <span className="address-form-error">{errors.phone}</span>}
            </div>
            <div className="address-form-field address-form-field--full">
              <label className="address-form-label" htmlFor="address-line-input">
                Địa chỉ chi tiết
              </label>
              <textarea
                id="address-line-input"
                className="address-form-textarea"
                value={formData.address_line}
                onChange={(event) => onChange('address_line', event.target.value)}
                placeholder="Số nhà, tên đường, khu vực..."
                required
              />
              {errors.address_line && <span className="address-form-error">{errors.address_line}</span>}
            </div>
            <div className="address-form-field">
              <label className="address-form-label" htmlFor="province-input">
                {getDivisionLabel(0, 'Tỉnh / Thành phố')}
              </label>
              <div
                className="address-combobox"
                data-open={dropdownOpen.province ? 'true' : 'false'}
                data-disabled={provinceDisabled ? 'true' : 'false'}
              >
                <input
                  id="province-input"
                  className="address-form-input address-combobox-input"
                  type="text"
                  value={provinceInputValue}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProvinceSearch(value);
                    if (value.trim() === '') {
                      handleProvinceSelection('');
                    }
                    if (!provinceDisabled) {
                      setDropdownOpen((prev) => ({ ...prev, province: true }));
                    }
                  }}
                  onFocus={() => {
                    if (!provinceDisabled) {
                      setDropdownOpen((prev) => ({ ...prev, province: true }));
                    }
                  }}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setDropdownOpen((prev) => ({ ...prev, province: false }));
                    }, 120);
                  }}
                  placeholder={`Tìm kiếm ${getDivisionLabel(0, 'Tỉnh / Thành phố')}`}
                  disabled={provinceDisabled}
                  aria-autocomplete="list"
                  role="combobox"
                  aria-expanded={dropdownOpen.province}
                  aria-controls="province-options"
                  aria-activedescendant={
                    selectedProvince ? `province-option-${selectedProvince.id}` : undefined
                  }
                />
                {optionsLoading.provinces && <span className="address-combobox-spinner" aria-hidden="true" />}
                {dropdownOpen.province && !provinceDisabled && (
                  <ul className="address-combobox-list" id="province-options" role="listbox">
                    {filteredProvinces.length === 0 ? (
                      <li
                        className="address-combobox-option address-combobox-option--empty"
                        role="option"
                        aria-disabled="true"
                      >
                        Không tìm thấy kết quả
                      </li>
                    ) : (
                      filteredProvinces.map((province) => {
                        const isSelected =
                          formData.province_id !== '' && province.id === Number(formData.province_id);
                        return (
                          <li
                            key={province.id}
                            id={`province-option-${province.id}`}
                            className={`address-combobox-option${isSelected ? ' is-selected' : ''}`}
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              handleProvinceSelection(province.id);
                              setProvinceSearch('');
                              setDropdownOpen((prev) => ({ ...prev, province: false }));
                            }}
                          >
                            <span className="address-combobox-option-label">{province.name}</span>
                            {/* {province.code && (
                              <span className="address-combobox-option-meta">{province.code}</span>
                            )} */}
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </div>
              {errors.province_id && <span className="address-form-error">{errors.province_id}</span>}
            </div>
            <div className="address-form-field">
              <label className="address-form-label" htmlFor="district-input">
                {getDivisionLabel(1, 'Quận / Huyện')}
              </label>
              <div
                className="address-combobox"
                data-open={dropdownOpen.district ? 'true' : 'false'}
                data-disabled={districtDisabled ? 'true' : 'false'}
              >
                <input
                  id="district-input"
                  className="address-form-input address-combobox-input"
                  type="text"
                  value={districtInputValue}
                  onChange={(event) => {
                    const value = event.target.value;
                    setDistrictSearch(value);
                    if (value.trim() === '') {
                      handleDistrictSelection('');
                    }
                    if (!districtDisabled) {
                      setDropdownOpen((prev) => ({ ...prev, district: true }));
                    }
                  }}
                  onFocus={() => {
                    if (!districtDisabled) {
                      setDropdownOpen((prev) => ({ ...prev, district: true }));
                    }
                  }}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setDropdownOpen((prev) => ({ ...prev, district: false }));
                    }, 120);
                  }}
                  placeholder={`Tìm kiếm ${getDivisionLabel(1, 'Quận / Huyện')}`}
                  disabled={districtDisabled}
                  aria-autocomplete="list"
                  role="combobox"
                  aria-expanded={dropdownOpen.district}
                  aria-controls="district-options"
                  aria-activedescendant={
                    selectedDistrict ? `district-option-${selectedDistrict.id}` : undefined
                  }
                />
                {optionsLoading.districts && <span className="address-combobox-spinner" aria-hidden="true" />}
                {dropdownOpen.district && !districtDisabled && (
                  <ul className="address-combobox-list" id="district-options" role="listbox">
                    {filteredDistricts.length === 0 ? (
                      <li
                        className="address-combobox-option address-combobox-option--empty"
                        role="option"
                        aria-disabled="true"
                      >
                        Không tìm thấy kết quả
                      </li>
                    ) : (
                      filteredDistricts.map((district) => {
                        const isSelected =
                          formData.district_id !== '' && district.id === Number(formData.district_id);
                        return (
                          <li
                            key={district.id}
                            id={`district-option-${district.id}`}
                            className={`address-combobox-option${isSelected ? ' is-selected' : ''}`}
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => {
                              handleDistrictSelection(district.id);
                              setDistrictSearch('');
                              setDropdownOpen((prev) => ({ ...prev, district: false }));
                            }}
                          >
                            <span className="address-combobox-option-label">{district.name}</span>
                            {district.code && (
                              <span className="address-combobox-option-meta">{district.code}</span>
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>
                )}
              </div>
              {errors.district_id && <span className="address-form-error">{errors.district_id}</span>}
            </div>
            {divisionStructure && divisionStructure.levels.length > 2 && (
              <div className="address-form-field">
                <label className="address-form-label" htmlFor="ward-input">
                  {getDivisionLabel(2, 'Phường / Xã')} (tuỳ chọn)
                </label>
                <div
                  className="address-combobox"
                  data-open={dropdownOpen.ward ? 'true' : 'false'}
                  data-disabled={wardDisabled ? 'true' : 'false'}
                >
                  <input
                    id="ward-input"
                    className="address-form-input address-combobox-input"
                    type="text"
                    value={wardInputValue}
                    onChange={(event) => {
                      const value = event.target.value;
                      setWardSearch(value);
                      if (value.trim() === '') {
                        handleWardSelection('');
                      }
                      if (!wardDisabled) {
                        setDropdownOpen((prev) => ({ ...prev, ward: true }));
                      }
                    }}
                    onFocus={() => {
                      if (!wardDisabled) {
                        setDropdownOpen((prev) => ({ ...prev, ward: true }));
                      }
                    }}
                    onBlur={() => {
                      window.setTimeout(() => {
                        setDropdownOpen((prev) => ({ ...prev, ward: false }));
                      }, 120);
                    }}
                    placeholder={`Tìm kiếm ${getDivisionLabel(2, 'Phường / Xã')}`}
                    disabled={wardDisabled}
                    aria-autocomplete="list"
                    role="combobox"
                    aria-expanded={dropdownOpen.ward}
                    aria-controls="ward-options"
                    aria-activedescendant={
                      selectedWard ? `ward-option-${selectedWard.id}` : undefined
                    }
                  />
                  {optionsLoading.wards && <span className="address-combobox-spinner" aria-hidden="true" />}
                  {dropdownOpen.ward && !wardDisabled && (
                    <ul className="address-combobox-list" id="ward-options" role="listbox">
                      {filteredWards.length === 0 ? (
                        <li
                          className="address-combobox-option address-combobox-option--empty"
                          role="option"
                          aria-disabled="true"
                        >
                          Không tìm thấy kết quả
                        </li>
                      ) : (
                        filteredWards.map((ward) => {
                          const isSelected =
                            formData.ward_id !== '' && ward.id === Number(formData.ward_id);
                          return (
                            <li
                              key={ward.id}
                              id={`ward-option-${ward.id}`}
                              className={`address-combobox-option${isSelected ? ' is-selected' : ''}`}
                              role="option"
                              aria-selected={isSelected}
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => {
                                handleWardSelection(ward.id);
                                setWardSearch('');
                                setDropdownOpen((prev) => ({ ...prev, ward: false }));
                              }}
                            >
                              <span className="address-combobox-option-label">{ward.name}</span>
                              {ward.code && (
                                <span className="address-combobox-option-meta">{ward.code}</span>
                              )}
                            </li>
                          );
                        })
                      )}
                    </ul>
                  )}
                </div>
                {errors.ward_id && <span className="address-form-error">{errors.ward_id}</span>}
              </div>
            )}
            <div className="address-form-field">
              <label className="address-form-label" htmlFor="postal-code-input">
                Mã bưu chính (tuỳ chọn)
              </label>
              <input
                id="postal-code-input"
                className="address-form-input"
                type="text"
                value={formData.postal_code}
                onChange={(event) => onChange('postal_code', event.target.value)}
                placeholder="Ví dụ: 700000"
              />
              {errors.postal_code && <span className="address-form-error">{errors.postal_code}</span>}
            </div>
            <div className="address-form-field address-form-field--full">
              <label className="address-form-check" htmlFor="default-checkbox">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(event) => onChange('is_default', event.target.checked)}
                />
                Đặt làm địa chỉ mặc định cho các đơn hàng sau này
              </label>
            </div>
            {errors.general && <div className="address-form-error">{errors.general}</div>}
            {!errors.general && optionsError && <div className="address-form-error">{optionsError}</div>}
          </form>
        </div>
        <footer className="address-modal__footer">
          <div className="address-form-actions">
            <button type="button" className="address-form-btn address-form-btn--ghost" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="address-form-btn address-form-btn--primary" disabled={loading} form="address-form">
              {loading ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AddressModal;
