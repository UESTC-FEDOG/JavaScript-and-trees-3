#基本类：TreeNode
表示树的一个节点
##构造函数：无
构造函数是内部调用的，不对外暴露

##实例上可以使用的属性和方法


+ value：该节点对应的值
+ children：数组，成员是该节点的子节点（请勿直接修改）
+ tree：指向该节点所属的树
+ appendChild(value)：value可以是任意值。若该TreeNode实例的子节点的个数已经超过TreeNode实例所属的树的CHILDREN_LIMIT则报错
    + value是TreeNode实例，则它的子节点个数不超过本实例所属的树的CHILDREN_LIMIT
    + value是Tree实例，则这个树的CHILDREN_LIMIT不能超过本实例所属的树的CHILDREN_LIMIT
    + 其它情况会被包装成一个TreeNode对象后成为实例的后代，添加到children中


#基本类：Tree
##构造函数：Tree

+ Tree(rootValue)：rootValue可以是任意值。会被作为根节点的value

##实例上可以使用的属性和方法

+ root：根节点，一个TreeNode实例。
+ preorderTraversal(callback)：返回this。先序遍历这个树。遍历时以所到的节点（TreeNode实例）作为参数调用callback
+ postorderTraversal(callback)：返回this。后序遍历这个树。其余同上
+ generate(height, initValue, n)：返回this.生成一个高度为height的n叉树。在非空的树上调用可能会报错
n可以是生成数字的函数（每一层都会调用），默认等于静态属性CHILDREN_LIMIT（对于基本类Tree，等于20）；
initValue可以是函数，每当生成一个节点前都会被调用（接收节点的value作为参数），
返回值作为该节点的value
+ find(value)：返回一个树内的一个节点（treeNode实例）或null。该节点是先序遍历时首个value值与value相同的节点。value也可以是一个有返回值的函数（接收这个节点，即一个TreeNode实例作为参数）
+ remove(treeNode)：返回this.接收一个treeNode实例，从树中删除它。失败时会静默失败
+ append(value, treeNode)：返回this.将value（可为任意类型）作为树中treeNode节点的子节点

##静态属性和方法
+ CHILDREN_LIMIT：表示该树的各后代节点的子元素的最大个数。为Infinity

#衍生类：BinaryTree
##构造函数：Tree

+ BinaryTree(rootValue)：rootValue可以是任意值。会被作为根节点的value

##实例上可以使用的属性和方法
继承Tree的全部方法，新增或修改了以下方法：

+ inorederTraversal(callbcak)：中序遍历这个树。其余同



##静态属性和方法

+ CHILDREN_LIMIT：表示该树的各后代节点的子元素的最大个数。为2