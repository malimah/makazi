const Platform = {
  OS: 'web',
  select: (obj) => obj.web || obj.default || {},
  isTesting: false,
  Version: 1,
};

export default Platform; 