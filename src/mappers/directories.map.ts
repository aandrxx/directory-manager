import Directory from "../models/directory.model";

export interface DirectoryNode {
  id: number;
  name: string;
  path: string;
  children: DirectoryNode[];
}

/**
 * Retrieves the parent path of a given path.
 * @param path The path to retrieve the parent path from
 * @returns The parent path
 */
export const getParentPath = (path: string): string => {
  // Handle empty path
  if (!path) return '';
  
  // Remove trailing slashes
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
  
  // Split by slash and filter out empty segments (handles multiple consecutive slashes)
  const names = normalizedPath.split('/').filter(segment => segment !== '');
  
  // Return the parent path
  return names.slice(0, names.length - 1).join('/');
};

/**
 * Maps directories to a tree structure.
 * @param directories The directories to map
 * @returns The mapped tree structure
 */
export const mapDirectoriesToTree = (
  directories: Directory[]
): DirectoryNode[] => {
  const rootNodes: DirectoryNode[] = [];

  const nodeMap = directories.reduce(
    (map: Record<string, DirectoryNode>, obj) => {
      map[obj.path] = {
        id: obj.id,
        name: obj.name,
        path: obj.path,
        children: [],
      };

      return map;
    },
    {}
  );

  directories.forEach((dir) => {
    const node = nodeMap[dir.path];
    if (!node) return;

    const parentPath = getParentPath(dir.path);

    if (parentPath && !!nodeMap[parentPath]) {
      nodeMap[parentPath].children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
};

/**
 * Maps a directory node to a string representation.
 * @param node The directory node to map
 * @param prefix The prefix to use for indentation
 * @returns The string representation of the directory node
 */
export const mapNodeToString = (node: DirectoryNode, prefix: string = ""): string => {
  if (!node.children.length) return prefix + node.name;

  return prefix + node.name + "\n" + node.children.map((child) => {
    return mapNodeToString(child, prefix + "  ");
  }).join("\n");
};
