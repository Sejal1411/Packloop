import { useState, useEffect } from 'react';
import { FiUser, FiUserPlus, FiMail, FiPhone, FiSearch, FiX, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { partnerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { toast } from 'react-hot-toast';

const Partners = () => {

    const { user, refreshTokenIfNeeded } = useAuth();
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);

    const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            setIsLoading(true);
            const response = await partnerService.getPartners();

            let pickupPartners = [];
             if (Array.isArray(response.data)) {

                // Direct array response
              pickupPartners = response.data.filter(
                partner => partner.role === 'PICKUP_PARTNER' && 
                (partner.mcpId === user.id || partner.mcpId === user._id)
            );
         } else if (response.data && response.data.data && response.data.data.partners) {

        // Nested data structure
        pickupPartners = response.data.data.partners.filter(
          partner => partner.role === 'PICKUP_PARTNER' && 
          (partner.mcpId === user.id || partner.mcpId === user._id)
        );
        } else if (response.data) {
        // Simple object response
        pickupPartners = Array.isArray(response.data) ? response.data : [response.data];
        pickupPartners = pickupPartners.filter(
          partner => partner.role === 'PICKUP_PARTNER' && 
          (partner.mcpId === user.id || partner.mcpId === user._id)
          );
        }
      
      setPartners(pickupPartners);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setIsLoading(false);
    }
    };

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{5,15}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      errors.phone = 'Phone number must be between 5-15 digits';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleCreatePartner = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Make sure we're using the correct ID format
      const mcpId = user.id || user._id;
      console.log('User object:', user);
      console.log('Using MCP ID:', mcpId);
      
      // Generate a timestamp to ensure uniqueness in phone and email
      const timestamp = new Date().getTime();
      const uniqueSuffix = timestamp.toString().substring(timestamp.toString().length - 6);
      
      const partnerData = {
        name: formData.name,
        email: formData.email,
        // Make phone unique with timestamp suffix if user didn't change the default
        phone: formData.phone.endsWith(uniqueSuffix) ? formData.phone : `${formData.phone}${uniqueSuffix}`,
        password: formData.password,
        role: 'PICKUP_PARTNER',
        mcpId: mcpId
      };
      
      console.log('Sending partner data:', partnerData);
      
      let response;
      try {
        // First attempt
        response = await partnerService.createPartner(partnerData);
      } catch (initialError) {
        if (initialError.response?.status === 401) {
          // Token might be expired, try to refresh and retry
          const refreshed = await refreshTokenIfNeeded();
          if (refreshed) {
            // Retry the request
            response = await partnerService.createPartner(partnerData);
          } else {
            throw initialError;
          }
        } else {
          throw initialError;
        }
      }
      
      console.log('Partner creation response:', response);
      toast.success('Partner created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Error creating partner:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      // Show specific error message from API if available
      let errorMessage = 'Failed to create partner';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    }
  };
}
   