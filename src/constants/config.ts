const server = import.meta.env.VITE_SERVER;
// User Apis
const signInApi = `${server}/user/signin`;
const signUpApi = `${server}/user/signup`;
const verifyOtpApi = `${server}/user/verify`;
const getUserProfileApi = `${server}/user/profile`;
const logOutApi = `${server}/user/logout`;

// Lead Source Apis
const uploadCSV = `${server}/source/upload`;
const getPaginatedData = `${server}/source`;
const deleteSourceApi = `${server}/source`;

// Template Apis
const templateApi = `${server}/template`;

// Flow Apis
const getFlow = `${server}/flowchart`;
const createFlowApi = `${server}/flowchart/create-flowchart`;
const createNodeApi = `${server}/flowchart/create-node`;
const createEdgeApi = `${server}/flowchart/create-edge`;
// const updateNodeApi = `${server}/flowchart/update`;
const removeFlow = `${server}/flowchart`;

export {
  signInApi,
  signUpApi,
  verifyOtpApi,
  getUserProfileApi,
  logOutApi,
  uploadCSV,
  getPaginatedData,
  templateApi,
  deleteSourceApi,
  getFlow,
  createFlowApi,
  createNodeApi,
  createEdgeApi,
  removeFlow,
};
