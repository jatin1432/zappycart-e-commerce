import React from "react";

const OrderRow = ({ order, onStatusChange }) => {
  const { _id, user, totalAmount, orderStatus } = order;

  return (
    <tr className="border-t">
      <td className="px-4 py-2 border">{user?.name || "N/A"}</td>
      <td className="px-4 py-2 border">{user?.email || "N/A"}</td>
      <td className="px-4 py-2 border">₹{totalAmount}</td>
      <td className="px-4 py-2 border capitalize">{orderStatus}</td>
      <td className="px-4 py-2 border">
        <select
          className="border px-2 py-1 rounded"
          value={orderStatus}
          onChange={(e) => onStatusChange(_id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </td>
    </tr>
  );
};

export default OrderRow;
