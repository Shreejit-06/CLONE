import { memo } from 'react';
import {
  // EdgeRemoveChange,
  NodeProps,
  NodeRemoveChange,
  Position
  // getConnectedEdges
} from 'reactflow';
import { shallow } from 'zustand/shallow';
import useStore from '../../store/store';
import CustomHandle from './CustomHandle';

type NodeData = {
  label: string;
};

const CustomDefaultNode = (props: NodeProps<NodeData>) => {
  const selector = (state: any) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    clickNodeCommand: state.clickNodeCommand,
    setClickNodeCommand: state.setClickNodeCommand
  });
  const {
    nodes,
    // edges,
    onNodesChange,
    // onEdgesChange,
    clickNodeCommand,
    setClickNodeCommand
  } = useStore(selector, shallow);

  const onDeleteNode = (node: NodeProps<NodeData>) => {
    //<---------- TO DELETE NODES FROM STORE ----------->
    const nodeToDeleteId = nodes.find((x: any) => {
      return x.id === node.id;
    }).id;
    const deleteNodeConfig: NodeRemoveChange = {
      id: nodeToDeleteId,
      type: 'remove'
    };
    onNodesChange([deleteNodeConfig]);

    //<---------- TO DELETE EDGES FROM STORE ----------->
    // const edgesToDeleteId = getConnectedEdges(nodes, edges)?.map(x => x.id);
    // edgesToDeleteId.forEach((id: string) => {
    //   const params: EdgeRemoveChange = {
    //     type: 'remove',
    //     id
    //   };
    //   onEdgesChange([params]);
    // });

    //<---------- TO DELETE CODES FROM STORE ----------->
    const nodeToDeleteCode = nodes.find(
      (x: any) => x.id === nodeToDeleteId
    )?.code;
    if (nodeToDeleteCode) {
      console.log('>>', nodeToDeleteCode);
      switch (nodeToDeleteCode) {
        case 'flagClick':
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('flagClick'),
            1
          );
          break;
        // @ts-ignore
        case 'clockwise':
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('clockwise'),
            1
          );
        case 'anticlockwise':
          const { rotate, ...rest } = clickNodeCommand;
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('anticlockwise'),
            1
          );
          setClickNodeCommand(rest, true);
          break;
        case 'move':
          const { move, ...rest1 } = clickNodeCommand;
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('move'),
            1
          );
          setClickNodeCommand(rest1, true);
          break;
        case 'goToPosition':
          const { randomPosition, ...rest2 } = clickNodeCommand;
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('goToPosition'),
            1
          );
          setClickNodeCommand(rest2, true);
          break;
        case 'goToPositionXY':
          const { xPosition, yPosition, ...rest3 } = clickNodeCommand;
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('goToPositionXY'),
            1
          );
          setClickNodeCommand(rest3, true);
          break;
        // @ts-ignore
        case 'saySomething':
        case 'saySomethingWithTimer':
          const { message, timer, ...rest4 } = clickNodeCommand;
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('saySomething'),
            1
          );
          clickNodeCommand.connectedNodes.splice(
            clickNodeCommand.connectedNodes.indexOf('saySomethingWithTimer'),
            1
          );
          setClickNodeCommand(rest4, true);
      }
    }
  };

  return (
    <div>
      <CustomHandle type='target' position={Position.Top} isConnectable={10} />
      <div className='custom-node relative'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            onClick={() => onDeleteNode(props)}
            className='w-4 h-4 absolute top-[-9px] right-[-8px] rotate-45 text-red-600 hover:text-red-400'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        {props.data.label}
      </div>
      <CustomHandle
        type='source'
        position={Position.Bottom}
        isConnectable={10}
      />
    </div>
  );
};

export default memo(CustomDefaultNode);
