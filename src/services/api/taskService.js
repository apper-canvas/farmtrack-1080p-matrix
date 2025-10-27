import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const taskService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords("task_c", {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "farm_id_c" } },
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
      console.error("Error fetching tasks:", error.message);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById("task_c", parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_at_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error.message);
      return null;
    }
  },

  create: async (taskData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          title_c: taskData.title_c || taskData.title,
          description_c: taskData.description_c || taskData.description || "",
          due_date_c: taskData.due_date_c || taskData.dueDate,
          priority_c: taskData.priority_c || taskData.priority,
          completed_c: false,
          completed_at_c: null,
          farm_id_c: taskData.farm_id_c ? parseInt(taskData.farm_id_c?.Id || taskData.farm_id_c) : null,
          crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c?.Id || taskData.crop_id_c) : null
        }]
      };

      if (!payload.records[0].farm_id_c) delete payload.records[0].farm_id_c;
      if (!payload.records[0].crop_id_c) delete payload.records[0].crop_id_c;

      const response = await apperClient.createRecord("task_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, JSON.stringify(failed));
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
      console.error("Error creating task:", error.message);
      toast.error("Failed to create task");
      return null;
    }
  },

  update: async (id, taskData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title_c || taskData.title,
          description_c: taskData.description_c || taskData.description || "",
          due_date_c: taskData.due_date_c || taskData.dueDate,
          priority_c: taskData.priority_c || taskData.priority,
          farm_id_c: taskData.farm_id_c ? parseInt(taskData.farm_id_c?.Id || taskData.farm_id_c) : null,
          crop_id_c: taskData.crop_id_c ? parseInt(taskData.crop_id_c?.Id || taskData.crop_id_c) : null
        }]
      };

      if (!payload.records[0].farm_id_c) delete payload.records[0].farm_id_c;
      if (!payload.records[0].crop_id_c) delete payload.records[0].crop_id_c;

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, JSON.stringify(failed));
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
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task");
      return null;
    }
  },

  toggleComplete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const currentTask = await taskService.getById(id);
      if (!currentTask) {
        toast.error("Task not found");
        return null;
      }

      const newCompletedStatus = !currentTask.completed_c;

      const payload = {
        records: [{
          Id: parseInt(id),
          completed_c: newCompletedStatus,
          completed_at_c: newCompletedStatus ? new Date().toISOString() : null
        }]
      };

      const response = await apperClient.updateRecord("task_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to toggle task completion:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error toggling task completion:", error.message);
      toast.error("Failed to update task status");
      return null;
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord("task_c", {
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
          console.error(`Failed to delete ${failed.length} tasks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting task:", error.message);
      toast.error("Failed to delete task");
      return false;
    }
  }
};

export default taskService;

export default taskService;