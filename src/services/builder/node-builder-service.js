class nodeBuilder {
    /**
     * Recursively maps an array of nodes using a custom mapper function.
     *
     * @param {Array} nodes - The array of nodes to be mapped.
     * @param {Object} options - Options for mapping.
     * @param {Function} options.mapper - A custom mapper function with signature (node, key, parentKey, idx) => mappedNode.
     * @returns {Array} The mapped nodes.
     * @throws {Error} If a custom mapper function is not provided.
     */
    recursiveNodeBuilder(nodes, options = {}) {
        if (typeof options.mapper !== 'function') {
            throw new Error('A custom mapper function (options.mapper) must be provided');
        }

        const mapNode = (node, idx, parentKey = "") => {
            const key = parentKey ? `${parentKey}-${idx}` : `${idx}`;
            const mappedNode = options.mapper(node, key, parentKey, idx);
            if (node.children && node.children.length > 0) {
                mappedNode.children = node.children.map((child, childIdx) =>
                    mapNode(child, childIdx, key)
                );
            }
            return mappedNode;
        };

        return nodes.map((node, idx) => mapNode(node, idx, ""));
    }
    /**
     * Generates a new path key for a node based on its current key and its children.
     *
     * @param {Object} node - The node for which to generate a new key.
     * @returns {string} A new key in the format "parentKey-index".
     */
    treeNodesPathGenerator(node) {
        const children = node.children || [];
        if (children.length === 0) {
            return `${node.key}-0`;
        }

        const lastChild = children[children.length - 1];
        const lastKeyParts = lastChild.key.split('-');
        const lastIndex = parseInt(lastKeyParts.pop(), 10);
        return `${node.key}-${lastIndex + 1}`;
    }
}

export default new nodeBuilder();
