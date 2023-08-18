const IsRunningInContainer = () => {
    const inDocker = process.env.RUNNING_IN_CONTAINER;
    return inDocker === 'true';
  };
  
module.exports = IsRunningInContainer;