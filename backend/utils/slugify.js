const slugify = async (text, Model) => {
  let slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  // Ensure uniqueness
  let unique = slug;
  let counter = 1;
  while (await Model.findOne({ where: { slug: unique } })) {
    unique = `${slug}-${counter++}`;
  }
  return unique;
};

module.exports = slugify;
