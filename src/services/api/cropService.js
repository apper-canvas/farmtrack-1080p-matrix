import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const cropService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("crop_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "area_planted_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error.message);
      toast.error("Failed to load crops");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("crop_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "area_planted_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error.message);
      return null;
    }
  },

  getByFarmId: async (farmId) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("crop_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "crop_name_c" } },
          { field: { Name: "variety_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_date_c" } },
          { field: { Name: "area_planted_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        where: [{
          FieldName: "farm_id_c",
          Operator: "EqualTo",
          Values: [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching crops for farm ${farmId}:`, error.message);
      return [];
    }
  },

  create: async (cropData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          crop_name_c: cropData.crop_name_c || cropData.cropName,
          variety_c: cropData.variety_c || cropData.variety,
          planting_date_c: cropData.planting_date_c || cropData.plantingDate,
          expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
          area_planted_c: parseFloat(cropData.area_planted_c || cropData.areaPlanted),
          status_c: cropData.status_c || cropData.status,
          notes_c: cropData.notes_c || cropData.notes || "",
          farm_id_c: parseInt(cropData.farm_id_c?.Id || cropData.farm_id_c || cropData.farmId)
        }]
      };

      const response = await apperClient.createRecord("crop_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, JSON.stringify(failed));
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
      console.error("Error creating crop:", error.message);
      toast.error("Failed to create crop");
      return null;
    }
  },

  update: async (id, cropData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          crop_name_c: cropData.crop_name_c || cropData.cropName,
          variety_c: cropData.variety_c || cropData.variety,
          planting_date_c: cropData.planting_date_c || cropData.plantingDate,
          expected_harvest_date_c: cropData.expected_harvest_date_c || cropData.expectedHarvestDate,
          area_planted_c: parseFloat(cropData.area_planted_c || cropData.areaPlanted),
          status_c: cropData.status_c || cropData.status,
          notes_c: cropData.notes_c || cropData.notes || "",
          farm_id_c: parseInt(cropData.farm_id_c?.Id || cropData.farm_id_c || cropData.farmId)
        }]
      };

      const response = await apperClient.updateRecord("crop_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, JSON.stringify(failed));
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
      console.error("Error updating crop:", error.message);
      toast.error("Failed to update crop");
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("crop_c", {
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
          console.error(`Failed to delete ${failed.length} crops:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting crop:", error.message);
      toast.error("Failed to delete crop");
      return false;
    }
  }
};

export default cropService;