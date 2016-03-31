var Tree = (function() {


    // 树的节点
    // 每个节点都有一个tree属性指向所属的树。但并未在原型或构造函数内定义
    function TreeNode(value) {
        this.value = value;
        this.children = [];
    }

    TreeNode.prototype.appendChild = function(node) {
        var isTreeNode = node instanceof TreeNode,
            isTree = node instanceof Tree,
            limit = this.tree.constructor.CHILDREN_LIMIT,
            errMessage = '节点本身或某后代节点的子节点个数可能超过了上限';
            
        if (this.children.length >= limit) throw Error(errMessage);
        
        // node仅是一个普通的值
        if (!isTree && !isTreeNode) {

            // 做个包装
            var newNode = new TreeNode(node);
            newNode.tree = this.tree;
            this.children.push(newNode);
            return this;
        }

        // node是树或者树节点[1]
        if (isTree && node.CHILDREN_LIMIT < limit) { // 这个判断条件太蠢了（当然CHIILDREN_LIMIT还是有必要的）。也许需要为Tree添加一个maxWidth的getter属性
            this.children.push(node.root);
            return this;
        } else if (isTreeNode && node.children.length < limit) {
            node.tree = this.tree;
            this.children.push(node);
            return this;
        } else {
            throw Error(errMessage);
        }
    };
    
    // value表示根节点的值
    function Tree(value) {
        this.root = new TreeNode(value);
        this.root.tree = this;

    }

    Tree.CHILDREN_LIMIT = Infinity;

    // 为树添加先序和后序遍历方法
    // todo: 将BinaryTree模块内的generateTraversal移过来
    Tree.prototype.preorderTraversal = function(callback) {
        function traversal(node) {
            if (node.children.length === 0) {
                callback(node);
                return;
            }

            callback(node);
            node.children.forEach(traversal);
        }

        traversal(this.root);
        return this;
    };
    
    Tree.prototype.postorderTraversal = function(callback) {
        function traversal(node) {
            
            if (node.children.length === 0) {
                callback(node);                
                return;
            }
            
            for (var i = 0; i < node.children.length; i ++) {
                traversal(node.children[i]);
            }
            callback(node);
            
            
        }

        traversal(this.root);
        
        return this;
    };

    
    
    // 添加 初始化一个高度为height的n叉树 的方法 （n可以是返回一个数字的函数。）
    // initValue表示每个节点的value
    // initValue可以是函数。每创建一个节点，该函数会以该节点的父节点的value为参数被调用；对于根节点，参数是该节点的value
    Tree.prototype.generate = function(height, initValue, n) {
        n = n  || this.constructor.CHILDREN_LIMIT; // [2]
        n = n === Infinity ? 20 : n;
        
        initValue = initValue === undefined ? null : initValue;
        
        this.root.value = typeof initValue === 'function' ? initValue(this.root.value) : initValue;
         
        // 由于n可能是函数，所以不得不作为参数传入每次递归，用以动态产生子节点个数 
        function append(node, currentHeight, n){
            var childrenCount = typeof n === 'function' ? n() : n;
            
            if(currentHeight >= height) return;
            
            for(var i = 0; i < childrenCount; i ++) {
                node.appendChild(new TreeNode(typeof initValue === 'function' ? initValue(node.value) : initValue));
                append(node.children[i], currentHeight + 1, n);
            }
        }
        
        append(this.root, 1, n);
        return this;
    };
    
    // 返回一个首次发现的节点。value可以是一个断言函数
    Tree.prototype.find = function(value) {
        var targetNode = null;
        try {
            this.preorderTraversal(function (node) {
                var predicate = typeof value === 'function' ? value(node) === node.value : value === node.value;
                if(predicate) {
                    targetNode = node;
                    throw new Error();
                } 
            });
        } catch(e) {}
        
        return targetNode;
    };
    
    Tree.prototype.remove = function (node) {
        if(!(node instanceof TreeNode) || node.tree !== this) return this;
        
        function findParent(parent) {
            if (parent.children.length <= 0) return null;
             
            var index = parent.children.indexOf(node);
            console.log(index);
            if(index >= 0) return parent;
            else {
                parent.children.forEach(function(node) {
                    return findParent(node);
                });
            }
        }
        
        var parent = findParent(this.root);
        if(parent === null) return this;
        
        var index =  parent.children.indexOf(node);
        parent.children.splice(index,1);
            
        
        return this;
    };
    
    Tree.prototype.append = function(newNodeValue, oldNode) {
        if(oldNode.tree !== this) throw new Error('树内不存在这一节点');
        oldNode.appendChild(new TreeNode(newNodeValue));
        return this;
    };
    
    return Tree;
} ());

var BinaryTree = (function(Tree) {

    // 二叉树构造函数，借用Tree构造函数
    function BinaryTree() {
        Tree.apply(this, arguments);
    }

    // 用于上文的[1]和[2]处
    Object.defineProperty(BinaryTree, 'CHILDREN_LIMIT', {
        value: 2,
        writable: false,
        configurable: false
    });

    // 普通的继承
    BinaryTree.prototype = Object.create(Tree.prototype);
    BinaryTree.prototype.constructor = BinaryTree;
    

    // 添加前中后序遍历的方法。可给遍历函数传入一个回调函数，遍历到每个节点时它都会收到该节点作为参数
    ['preorderTraversal', 'inorderTraversal', 'postorderTraversal'].forEach(function(name, index) {
        BinaryTree.prototype[name] = function(callback) {
            generateTraversal(index, callback)(this.root);
            return this;
        };
    });

    // 生成遍历函数的函数。order决定了是前、中、后序中的哪一个
    function generateTraversal(order, callback) {

        // 这是实际进行递归遍历的函数    
        return function traversal(node) {
            // 递归的终止条件：没有子节点了
            if (node.children.length === 0) {
                callback(node);
                return;
            }

            // 三种遍历方法的唯一区别在于traversal函数作用于节点的顺序
            // 用process数组来确定traversal函数的顺序
            var process = [traversal.bind(null, node.children[0]), traversal.bind(null, node.children[1])],
                callbackBind = callback.bind(null, node);

            switch (order) {
                case 0:
                    process.unshift(callbackBind);
                    break;
                case 1:
                    process.splice(1, 0, callbackBind);
                    break;
                case 2:
                    process.push(callbackBind);
                    break;
                default:
                    throw new Error('没有这样的遍历方法');
            }

            // 开始遍历。
            process.forEach(function(func) {
                func();
            });
        };
    }

    return BinaryTree;
} (Tree));
