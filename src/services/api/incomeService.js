import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const incomeService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("income_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "buyer_c" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching income:", error.message);
      toast.error("Failed to load income");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("income_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "quantity_c" } },
          { field: { Name: "price_per_unit_c" } },
          { field: { Name: "buyer_c" } },
          { field: { Name: "total_amount_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching income ${id}:`, error.message);
      return null;
    }
  },

  create: async (incomeData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const quantity = parseFloat(incomeData.quantity_c || incomeData.quantity);
      const pricePerUnit = parseFloat(incomeData.price_per_unit_c || incomeData.pricePerUnit);

      const payload = {
        records: [{
          date_c: incomeData.date_c || incomeData.date,
          quantity_c: quantity,
          price_per_unit_c: pricePerUnit,
          buyer_c: incomeData.buyer_c || incomeData.buyer,
          total_amount_c: quantity * pricePerUnit,
          crop_id_c: parseInt(incomeData.crop_id_c?.Id || incomeData.crop_id_c || incomeData.cropId)
        }]
      };

      const response = await apperClient.createRecord("income_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} income records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating income:", error.message);
      toast.error("Failed to create income");
      return null;
    }
  },

  update: async (id, incomeData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const quantity = parseFloat(incomeData.quantity_c || incomeData.quantity);
      const pricePerUnit = parseFloat(incomeData.price_per_unit_c || incomeData.pricePerUnit);

      const payload = {
        records: [{
          Id: parseInt(id),
          date_c: incomeData.date_c || incomeData.date,
          quantity_c: quantity,
          price_per_unit_c: pricePerUnit,
          buyer_c: incomeData.buyer_c || incomeData.buyer,
          total_amount_c: quantity * pricePerUnit,
          crop_id_c: parseInt(incomeData.crop_id_c?.Id || incomeData.crop_id_c || incomeData.cropId)
        }]
      };

      const response = await apperClient.updateRecord("income_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} income records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
            }
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating income:", error.message);
      toast.error("Failed to update income");
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("income_c", {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} income records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting income:", error.message);
      toast.error("Failed to delete income");
      return false;
    }
  }
};
export default incomeService;