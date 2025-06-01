import { col, fn, literal, Op } from "sequelize";
import Directory from "../models/directory.model";

/**
 * Retrieves all paths from a given path.
 * @param path The path to retrieve paths from
 * @returns An array of paths
 */
export const getAllPaths = (path: string): string[] => {
  return path
    .split("/")
    .reduce(
      (acc: string[], name) => [
        ...acc,
        ...(acc.length > 0 ? [[acc.slice(-1), name].join("/")] : [name]),
      ],
      []
    );
};

/**
 * Retrieves a directory from the database by path.
 * @param path The path of the directory to retrieve
 * @returns The Directory object if found, or null if not found
 */
export const getDirectory = async (path: string): Promise<Directory | null> => {
  return Directory.findOne({
    where: {
      path,
    },
  });
};

/**
 * Creates a directory and its children in the database.
 * @param path The path of the directory to create
 * @returns A boolean indicating whether the creation was successful
 */
export const createDirectory = async (path: string): Promise<boolean> => {
  const paths = getAllPaths(path);

  await Directory.bulkCreate(
    paths.map((path) => ({
      name: path.split("/").pop(),
      path,
    })),
    {
      ignoreDuplicates: true,
    }
  );

  return true;
};

/**
 * Moves a directory and its children to a new location.
 * @param sourcePath The path of the directory to move
 * @param targetPath The path of the new location
 * @returns A boolean indicating whether the move was successful
 */
export const moveDirectory = async (
  sourcePath: string,
  targetPath: string
): Promise<boolean> => {
  const sourceDirectory = await getDirectory(sourcePath);
  if (!sourceDirectory)
    throw new Error(
      `Cannot move ${sourcePath} - ${sourcePath.split("/").pop()} does not exist.`
    );

  // Delete directories that already exist in the target path
  await Directory.destroy({
    where: {
      [Op.and]: [
        {
          path: {
            [Op.like]: `${sourcePath}%`,
          },
        },
        literal(
          `EXISTS(SELECT 1 FROM directories tmp WHERE tmp.path = concat ('${targetPath}/${sourceDirectory.name}', substring(directories.path, ${sourcePath.length + 1})))`
        ),
      ],
    },
  });

  await Directory.update(
    {
      path: fn(
        "concat",
        `${targetPath}/${sourceDirectory.name}`,
        fn("substring", col("path"), sourcePath.length + 1)
      ),
    },
    {
      where: {
        path: {
          [Op.like]: `${sourcePath}%`,
        },
      },
    }
  );

  await createDirectory(targetPath);

  return true;
};

/**
 * Deletes a directory and its children from the database.
 * @param path The path of the directory to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export const deleteDirectory = async (path: string): Promise<boolean> => {
  const directory = await getDirectory(path);
  if (!directory)
    throw new Error(
      `Cannot delete ${path} - ${path.split("/").pop()} does not exist.`
    );

  await Directory.destroy({
    where: {
      path: {
        [Op.like]: `${path}%`,
      },
    },
  });

  return true;
};

/**
 * Lists all directories in the database.
 * @returns An array of Directory objects
 */
export const listDirectory = async (): Promise<Directory[]> => {
  const children = await Directory.findAll({
    order: [["path", "ASC"]],
  });

  return children;
};
