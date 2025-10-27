import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AddressOption {
  id: number;
  name: string;
  code: string;
}

interface NewAddress {
  name: string;
  phone: string;
  address: string;
  province_id: string;
  district_id: string;
  ward_id: string;
  is_default: boolean;
}

interface CheckoutAddressFormProps {
  onSubmit: (address: NewAddress) => Promise<void>;
  onCancel: () => void;
}

const CheckoutAddressForm: React.FC<CheckoutAddressFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<NewAddress>({
    name: '',
    phone: '',
    address: '',
    province_id: '',
    district_id: '',
    ward_id: '',
    is_default: false,
  });

  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [districts, setDistricts] = useState<AddressOption[]>([]);
  const [wards, setWards] = useState<AddressOption[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const response = await axios.get('/addresses/provinces');
      if (response.data?.success) {
        setProvinces(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load provinces:', error);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadDistricts = async (provinceId: string) => {
    if (!provinceId) {
      setDistricts([]);
      setWards([]);
      return;
    }

    setLoadingDistricts(true);
    try {
      const response = await axios.get(`/addresses/districts/${provinceId}`);
      if (response.data?.success) {
        setDistricts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadWards = async (districtId: string) => {
    if (!districtId) {
      setWards([]);
      return;
    }

    setLoadingWards(true);
    try {
      const response = await axios.get(`/addresses/wards/${districtId}`);
      if (response.data?.success) {
        setWards(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load wards:', error);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    setFormData({
      ...formData,
      province_id: provinceId,
      district_id: '',
      ward_id: '',
    });
    setDistricts([]);
    setWards([]);
    if (provinceId) {
      loadDistricts(provinceId);
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setFormData({
      ...formData,
      district_id: districtId,
      ward_id: '',
    });
    setWards([]);
    if (districtId) {
      loadWards(districtId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nhập họ tên"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Số điện thoại <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Nhập số điện thoại"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Địa chỉ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Số nhà, tên đường"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent"
        />
      </div>

      {/* Province & District */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.province_id}
            onChange={(e) => handleProvinceChange(e.target.value)}
            disabled={loadingProvinces}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.district_id}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!formData.province_id || loadingDistricts}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ward */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.ward_id}
          onChange={(e) => setFormData({ ...formData, ward_id: e.target.value })}
          disabled={!formData.district_id || loadingWards}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ring-primary focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">Chọn phường/xã</option>
          {wards.map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {/* Default checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_default"
          checked={formData.is_default}
          onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
          className="w-4 h-4 accent-primary rounded"
        />
        <label htmlFor="is_default" className="text-sm text-gray-700">
          Đặt làm địa chỉ mặc định
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2.5 btn-primary rounded-lg transition-colors duration-200 disabled:bg-gray-400"
        >
          {submitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
        </button>
      </div>
    </form>
  );
};

export default CheckoutAddressForm;
