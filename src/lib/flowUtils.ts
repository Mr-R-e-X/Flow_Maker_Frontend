import { CustomNode } from "@/store/slices/flowChartSlice";
import { singeList } from "@/store/slices/listSlice";
import { template } from "@/store/slices/templateSlice";
import { ApiResponse } from "@/types/responses";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const CustomSwal = withReactContent(Swal);

export const promptSequenceName = async () => {
  try {
    const result = await Swal.fire({
      title: "Set Sequence Name",
      input: "text",
      inputPlaceholder: "Enter sequence name",
      showCancelButton: false,
      confirmButtonText: "Save",
      customClass: {
        popup:
          "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
        confirmButton:
          "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-blue-500",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a name!";
        }
      },
    });

    return result;
  } catch (error) {
    console.error("Error with SweetAlert:", error);
  }
};

export const promptEditSequenceName = async (name: string) => {
  try {
    const result = await Swal.fire({
      title: "Edit Sequence Name",
      input: "text",
      inputValue: name,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        popup:
          "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
        confirmButton:
          "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-blue-500",
        cancelButton:
          "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-red-500",
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a name!";
        }
      },
    });

    return result;
  } catch (error) {
    console.error("Error with SweetAlert:", error);
  }
};

export const handleLeadSourceAlert = async (leadSourceList: singeList[]) => {
  const optionsHtml = leadSourceList.length
    ? leadSourceList
        .map((item) => `<option value="${item._id}">${item.name}</option>`)
        .join("")
    : `<p>No lead sources available. <a href="/lead-sources" class="text-green-500 underline">Please create one</a></p>`;

  const { value } = await CustomSwal.fire({
    title: '<span class="text-white">Select Lead Source</span>',
    html: `
      <div class="text-left mb-4">
        <label for="swal-select" class="block text-sm font-bold text-gray-300 mb-2">
          Select Lead Source:
        </label>
        ${
          leadSourceList.length
            ? `<select 
                id="swal-select" 
                class="block w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring focus:ring-blue-500">
                ${optionsHtml}
              </select>`
            : optionsHtml
        }
      </div>
    `,
    focusConfirm: false,
    confirmButtonText: "Save",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    customClass: {
      popup:
        "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
      confirmButton:
        "bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-blue-500",
      cancelButton:
        "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-red-500",
    },
    preConfirm: () => {
      const selectElement = document.getElementById(
        "swal-select"
      ) as HTMLSelectElement;

      if (!selectElement || !selectElement.value) {
        Swal.showValidationMessage("Please select a lead source.");
        return null;
      }

      const selectedText =
        selectElement.options[selectElement.selectedIndex].text;

      return { value: selectElement.value, element: selectedText };
    },
  });

  return value;
};

export const handleEmailSourceAlert = async (templateList: template[]) => {
  const optionsHtml = templateList.length
    ? templateList
        .map((item) => `<option value="${item._id}">${item.name}</option>`)
        .join("")
    : `<p>No templates available. <a href="/template-editor" class="text-blue-500 underline">Please create one</a></p>`;
  const { value } = await CustomSwal.fire({
    title: '<span class="text-white">Choose Email Template</span>',
    html: `
        <div class="text-left mb-4">
          <label for="swal-select" class="block text-sm font-bold text-gray-300 mb-2">
            Select a Template:
          </label>
           ${
             templateList.length
               ? `<select 
                id="swal-select" 
                class="block w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring focus:ring-blue-500">
                ${optionsHtml}
              </select>`
               : optionsHtml
           }
        </div>
      `,
    focusConfirm: false,
    confirmButtonText: "Save",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    customClass: {
      popup:
        "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
      confirmButton:
        "bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-blue-500",
      cancelButton:
        "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-red-500",
    },
    preConfirm: () => {
      const selectElement = document.getElementById(
        "swal-select"
      ) as HTMLSelectElement;

      const selectedText =
        selectElement.options[selectElement.selectedIndex].text;

      if (!selectElement || !selectElement.value) {
        Swal.showValidationMessage("Please select a template.");
        return null;
      }
      return { value: selectElement.value, element: selectedText };
    },
  });
  return value;
};

export const handleDelaySourceAlert = async () => {
  const { value } = await CustomSwal.fire({
    title: '<span class="text-white">Set Delay</span>',
    html: `
        <div class="text-left mb-4">
          <label for="swal-input" class="block text-sm font-bold text-gray-300 mb-2">
            Delay Value:
          </label>
          <input 
            id="swal-input" 
            type="number" 
            class="block w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring focus:ring-orange-500" 
            placeholder="Enter a number"
            min="1"
          />
          <label for="swal-select" class="block text-sm font-bold text-gray-300 mt-4 mb-2">
            Delay Unit:
          </label>
          <select 
            id="swal-select" 
            class="block w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring focus:ring-orange-500"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      `,
    focusConfirm: false,
    confirmButtonText: "Save",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    customClass: {
      popup:
        "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
      confirmButton:
        "bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-orange-500",
      cancelButton:
        "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-red-500",
    },
    preConfirm: () => {
      const inputElement = document.getElementById(
        "swal-input"
      ) as HTMLInputElement;
      const selectElement = document.getElementById(
        "swal-select"
      ) as HTMLSelectElement;

      const value = inputElement?.value;
      const unit = selectElement?.value;

      if (!value || parseInt(value) <= 0) {
        Swal.showValidationMessage(
          "Please enter a valid number greater than 0."
        );
        return null;
      }
      return `${value} ${unit}`;
    },
  });
  return value;
};

export const handleSaveSequence = async () => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: '<span class="text-white">Save Sequence</span>',
    html: `
      <div class="flex flex-col gap-4">
        <div>
          <label for="sequence-name" class="block text-sm font-bold text-gray-300 mb-1">Name:</label>
          <input 
            id="sequence-name"
            type="text"
            class="block w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring focus:ring-blue-500"
            placeholder="Enter a name for your sequence"
          />
        </div>
        <div>
          <label for="sequence-description" class="block text-sm font-bold text-gray-300 mb-1">Description:</label>
          <textarea
            id="sequence-description"
            class="block w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring focus:ring-blue-500"
            placeholder="Enter a description for your sequence"
          ></textarea>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Save and Live",
    cancelButtonText: "Cancel",
    customClass: {
      popup:
        "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
      confirmButton:
        "bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-blue-500",
      cancelButton:
        "bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:ring focus:ring-red-500",
    },
    preConfirm: () => {
      const nameInput = (
        document.getElementById("sequence-name") as HTMLInputElement
      )?.value.trim();
      const descriptionInput = (
        document.getElementById("sequence-description") as HTMLTextAreaElement
      )?.value.trim();

      if (!nameInput || !descriptionInput) {
        Swal.showValidationMessage("Please provide both name and description.");
        return null;
      }

      return { name: nameInput, description: descriptionInput };
    },
  });

  if (isConfirmed && formValues) {
    return formValues;
  }

  return null;
};

export const basicNoty = async (
  icon: SweetAlertIcon,
  title: string,
  text: string,
  confirmButtonText: string
) => {
  await Swal.fire({
    icon,
    title,
    text,
    confirmButtonText,
    customClass: {
      popup:
        "bg-gray-900 rounded-lg shadow-lg border border-gray-700 text-white",
    },
  });
};

export const createNodeandEdgeIdList = (
  createdNodes: ApiResponse,
  createdEdges: ApiResponse
): { nodes: string[]; edges: string[] } => {
  const nodes: string[] = [];
  const edges: string[] = [];

  createdNodes.data.forEach((node: CustomNode) => {
    if (node?._id) nodes.push(node._id);
  });

  createdEdges.data.forEach((edge) => {
    if (edge?._id) edges.push(edge._id);
  });

  return { nodes, edges };
};

export const checkAllNodeValid = (nodes: CustomNode[]) => {
  let flag = false;
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]?.data?.source) {
      return false;
    } else {
      flag = true;
    }
  }
  return flag;
};
