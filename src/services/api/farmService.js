import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const farmService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("farm_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "total_area_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching farms:", error.message);
      toast.error("Failed to load farms");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("farm_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "total_area_c" } },
          { field: { Name: "unit_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error.message);
      return null;
    }
  },

  create: async (farmData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          name_c: farmData.name_c || farmData.name,
          location_c: farmData.location_c || farmData.location,
          total_area_c: parseFloat(farmData.total_area_c || farmData.totalArea),
          unit_c: farmData.unit_c || farmData.unit,
          notes_c: farmData.notes_c || farmData.notes || "",
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord("farm_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:`, JSON.stringify(failed));
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
      console.error("Error creating farm:", error.message);
      toast.error("Failed to create farm");
      return null;
    }
  },

  update: async (id, farmData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          name_c: farmData.name_c || farmData.name,
          location_c: farmData.location_c || farmData.location,
          total_area_c: parseFloat(farmData.total_area_c || farmData.totalArea),
          unit_c: farmData.unit_c || farmData.unit,
          notes_c: farmData.notes_c || farmData.notes || ""
        }]
      };

      const response = await apperClient.updateRecord("farm_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:`, JSON.stringify(failed));
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
      console.error("Error updating farm:", error.message);
      toast.error("Failed to update farm");
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("farm_c", {
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
          console.error(`Failed to delete ${failed.length} farms:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting farm:", error.message);
      toast.error("Failed to delete farm");
      return false;
    }
  }
};

export default farmService;