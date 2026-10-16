/* Dispatches a page's tool config to the right interactive component.
   Server component: wraps client tools in the original section markup. */

import type { ToolConfig } from '@/lib/types';
import { DecoratorTool } from './DecoratorTool';
import { FontTool } from './FontTool';
import { UsernameTool } from './UsernameTool';
import { CardsTool } from './CardsTool';
import { InvisibleTool, NamesTool, SymbolsTool } from './StaticTools';

export function ToolBlock({ tool }: { tool: ToolConfig }) {
  let inner: React.ReactNode = null;
  switch (tool.kind) {
    case 'decorator':
      inner = (
        <DecoratorTool
          defaultFilter={tool.defaultFilter ?? 'all'}
          placeholder={tool.placeholder}
          note={tool.note}
        />
      );
      break;
    case 'font':
      inner = <FontTool fontId={tool.fontId ?? 'bold'} />;
      break;
    case 'username':
      inner = <UsernameTool />;
      break;
    case 'symbols-static':
      inner = <SymbolsTool groups={tool.groups} />;
      break;
    case 'invisible':
      inner = <InvisibleTool />;
      break;
    case 'cards':
      inner = <CardsTool mode={tool.mode ?? 'all'} />;
      break;
    case 'names':
      inner = <NamesTool names={tool.names ?? []} />;
      break;
  }
  return (
    <section className="block" style={{ paddingTop: 0 }}>
      <div className="container">{inner}</div>
    </section>
  );
}
