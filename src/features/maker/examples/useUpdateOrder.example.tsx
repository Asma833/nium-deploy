/**
 * Example usage of useUpdateOrder hook
 *
 * This file demonstrates how to use the useUpdateOrder hook in your components
 */

import { useUpdateOrder } from '../hooks/useUpdateOrder';
import { UpdateOrderRequest, PartialUpdateOrderRequest } from '../types/update-order.types';

// Example component showing how to use the hook
export const ExampleUpdateOrderUsage = () => {
  const updateOrderMutation = useUpdateOrder();

  // Example 1: Full order update (as per the cURL example)
  const handleFullOrderUpdate = () => {
    const fullOrderData: UpdateOrderRequest = {
      order_id: 'BMFORDERID432',
      transaction_type: 'a8712d83154960b9d3803d30b1112cam84dhj1k',
      purpose_type: '378dcac6a3a4c46cc11e112b91a99e8m84dbjsa',
      is_e_sign_required: true,
      is_v_kyc_required: true,
      customer_name: 'john',
      customer_email: 'joh@gmail.com',
      customer_phone: '9950895486',
      customer_pan: 'CBIPT0799K',
      order_status: 'pending',
      e_sign_status: 'Pending',
      e_sign_link: 'https://esign-link.com',
      e_sign_link_status: 'active',
      e_sign_link_request_id: '6ae8a7a6-55fa-457b-932f-a4ba271f8eee',
      e_sign_link_doc_id: '01JP0HHA4WF7V3X7HA',
      e_sign_link_expires: '2025-03-30T12:00:00.000Z',
      e_sign_completed_by_customer: false,
      e_sign_customer_completion_date: '2025-03-13T08:40:53.328Z',
      e_sign_doc_comments: 'Signed successfully',
      v_kyc_profile_id: '93849',
      v_kyc_reference_id: '787678',
      v_kyc_status: 'Pending',
      v_kyc_link: 'https://vkyc-link.com',
      v_kyc_link_status: 'active',
      v_kyc_link_expires: '2025-03-30T12:00:00.000Z',
      v_kyc_completed_by_customer: false,
      v_kyc_customer_completion_date: '2025-03-13T08:40:53.328Z',
      v_kyc_comments: 'KYC verified',
      is_esign_regenerated: false,
      is_esign_regenerated_details: {
        reason: 'expired',
      },
      is_video_kyc_link_regenerated: false,
      is_video_kyc_link_regenerated_details: {
        reason: 'expired',
      },
      created_by: '00eb04d0-646c-41d5-a69e-197b2b504f01',
      updated_by: '00eb04d0-646c-41d5-a69e-197b2b504f01',
      checker_id: '49592f43-c59f-4084-bf3a-79a7ba6f182e',
    };

    updateOrderMutation.mutate({
      partnerOrderId: 'PORD001',
      data: fullOrderData,
    });
  };

  // Example 2: Partial order update (only specific fields)
  const handlePartialOrderUpdate = () => {
    const partialOrderData: PartialUpdateOrderRequest = {
      order_status: 'completed',
      e_sign_status: 'Completed',
      e_sign_completed_by_customer: true,
      e_sign_customer_completion_date: new Date().toISOString(),
      updated_by: 'current-user-id',
    };

    updateOrderMutation.mutate({
      partnerOrderId: 'PORD001',
      data: partialOrderData,
    });
  };

  // Example 3: Update order status only
  const handleStatusUpdate = (partnerOrderId: string, newStatus: string) => {
    updateOrderMutation.mutate({
      partnerOrderId,
      data: {
        order_status: newStatus,
        updated_by: 'current-user-id',
      },
    });
  };

  return (
    <div>
      <h3>Update Order Examples</h3>
      <button onClick={handleFullOrderUpdate} disabled={updateOrderMutation.isPending}>
        {updateOrderMutation.isPending ? 'Updating...' : 'Full Update'}
      </button>

      <button onClick={handlePartialOrderUpdate} disabled={updateOrderMutation.isPending}>
        {updateOrderMutation.isPending ? 'Updating...' : 'Partial Update'}
      </button>

      <button onClick={() => handleStatusUpdate('PORD001', 'approved')} disabled={updateOrderMutation.isPending}>
        {updateOrderMutation.isPending ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
};

// Hook usage pattern for other components:
/*
import { useUpdateOrder } from '@/features/maker/hooks/useUpdateOrder';

const MyComponent = () => {
  const updateOrderMutation = useUpdateOrder();

  const handleUpdate = (partnerOrderId: string, updateData: PartialUpdateOrderRequest) => {
    updateOrderMutation.mutate({
      partnerOrderId,
      data: updateData
    });
  };

  // Access loading state
  const isUpdating = updateOrderMutation.isPending;
  
  // Access error state
  const error = updateOrderMutation.error;
  
  // Access success state
  const isSuccess = updateOrderMutation.isSuccess;

  return (
    // Your component JSX
  );
};
*/
