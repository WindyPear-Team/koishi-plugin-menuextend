import { Context, Schema } from 'koishi'

export const name = 'menuextend'

export interface Config {
  prefix: string                  // 指令前缀
  categories: Record<string, {    // 指令分类和对应的指令列表
    description: string           // 分类的描述
    header: string                // 分类帮助菜单开头文本
    footer: string                // 分类帮助菜单结尾文本
    commands: Record<string, {    // 每个分类内的指令及其描述
      description: string          // 指令的描述
    }>
  }>
}

// 配置结构，添加顶端提示信息
export const Config: Schema<Config> = Schema.object({
  prefix: Schema.string().default('/').description('指令前缀'),
  categories: Schema.dict(Schema.object({
    description: Schema.string().description('分类的描述'),
    header: Schema.string().default('当前可用的指令有：').description('帮助菜单开头的文本'),
    footer: Schema.string().default('输入“/help 指令名”以获取该指令详细帮助信息').description('帮助菜单结尾的文本'),
    commands: Schema.dict(Schema.object({
      description: Schema.string().description('指令的描述'),
    })).description('指令和描述的字典')
  })).description(''),
}).description('请自行填入指令和隐藏原指令，本插件并不能自动获取指令和对指令进行分类')

// 插件主体
export function apply(ctx: Context, config: Config) {
  // 遍历配置中定义的分类，创建每个分类的指令
  for (const [category, { description, header, footer, commands }] of Object.entries(config.categories)) {
    ctx.command(`${config.prefix}${category}`, description)
      .action(async ({ session }) => {
        // 构建分类的帮助菜单
        let response = `${header}\n`
        
        for (const [command, { description: desc }] of Object.entries(commands)) {
          response += `  ${config.prefix}${command}  ${desc}\n`
        }

        response += `\n${footer}`
        
        // 返回给用户
        return session.send(response)
      })
  }
}
