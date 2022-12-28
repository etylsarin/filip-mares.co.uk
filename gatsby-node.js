exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: `/?*`,
    toPath: `/`,
  });

  createRedirect({
    fromPath: `/aaa`,
    toPath: `/`,
  });
};
