import { View, Text } from "@tarojs/components";
import "./index.scss";

export default function AiNoticePage() {
  return (
    <View className="container">
      <View className="card">
        <Text className="legal-title">AI 生成说明</Text>
        <Text className="legal-p">本站部分解读内容由人工智能（AI）辅助生成，请您在使用前了解以下事项。</Text>
        <Text className="legal-h2">一、生成方式</Text>
        <Text className="legal-p">AI 解读基于传统典籍知识框架，结合您提供的卦象、签文、八字、梦境等信息，由大语言模型生成文字说明。生成内容可能存在不准确或不完整之处。</Text>
        <Text className="legal-h2">二、内容性质</Text>
        <Text className="legal-p">AI 生成内容属于传统文化参考，不代表专业命理师的个人判断，也不构成医疗、法律、投资等专业建议。</Text>
        <Text className="legal-h2">三、使用建议</Text>
        <Text className="legal-p">请将 AI 解读作为了解传统文化的辅助工具，结合自身体验理性判断。遇到重大人生决策，请咨询相关专业人士。</Text>
        <Text className="legal-h2">四、标识说明</Text>
        <Text className="legal-p">凡标注「AI 解读」「智能阐释」的内容均为 AI 辅助生成。免费概要解读与付费详批均可能包含 AI 生成部分。</Text>
      </View>
    </View>
  );
}
