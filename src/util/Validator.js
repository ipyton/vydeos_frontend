const crypto = require('crypto');
// This file is used to validate the information integrity.
// the information provided give user chance to fix partial data.
class MerkleNode {
    constructor(left = null, right = null, hash = '') {
        this.left = left;
        this.right = right;
        this.hash = hash;
    }
}

class MerkleTree {
    constructor(data) {
        this.leaves = data.map(item => new MerkleNode(null, null, this.hashData(item)));
        this.root = this.buildTree(this.leaves);
    }

    // 哈希函数
    hashData(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    // 构建 Merkle Tree
    buildTree(nodes) {
        if (nodes.length === 1) {
            return nodes[0];
        }

        const newLevel = [];

        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i];
            const right = i + 1 < nodes.length ? nodes[i + 1] : left; // 如果有奇数个节点，重复最后一个节点
            const combinedHash = this.hashData(left.hash + right.hash);
            newLevel.push(new MerkleNode(left, right, combinedHash));
        }

        return this.buildTree(newLevel);
    }

    // 获取根哈希
    getRootHash() {
        return this.root.hash;
    }

    // 验证数据
    verifyData(data, proof) {
        let hash = this.hashData(data);

        for (const p of proof) {
            hash = this.hashData(hash + p);
        }

        return hash === this.root.hash;
    }

    // 获取数据的验证路径
    getProof(index) {
        const proof = [];
        this._getProof(this.root, index, proof);
        return proof;
    }

    _getProof(node, index, proof) {
        if (node.left === null && node.right === null) {
            return; // 到达叶子节点
        }

        if (node.left) {
            if (index < this.leaves.length / 2) {
                // 左侧节点
                proof.push(node.right.hash);
                this._getProof(node.left, index, proof);
            } else {
                // 右侧节点
                proof.push(node.left.hash);
                this._getProof(node.right, index - this.leaves.length / 2, proof);
            }
        }
    }
}

// 示例用法
const data = ['data1', 'data2', 'data3', 'data4'];
const merkleTree = new MerkleTree(data);

console.log('根哈希:', merkleTree.getRootHash());

const index = 2; // 假设我们要验证 data3
const proof = merkleTree.getProof(index);
console.log('验证路径:', proof);

const isValid = merkleTree.verifyData(data[index], proof);
console.log('验证结果:', isValid);
