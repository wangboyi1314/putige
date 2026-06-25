import { LegalDoc } from "@/components/LegalDoc";

export default function PrivacyPage() {
  return (
    <LegalDoc title="隐私说明">
      <p>菩提阁重视您的隐私保护。本说明阐述我们如何收集、使用和保护您的信息。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">一、信息收集</h2>
      <p>为提供排盘、解读等服务，我们可能收集您主动输入的出生日期、问事内容、上传的照片等。部分记录保存在您设备的本地存储中。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">二、信息使用</h2>
      <p>收集的信息仅用于生成传统文化参考解读，不会用于与提供服务无关的目的。涉及 AI 解读的内容会发送至第三方大模型 API 进行处理。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">三、信息存储</h2>
      <p>心愿记录、问事记录等主要存储在您的浏览器本地。支付相关信息由支付平台处理，本站不存储银行卡或支付密码。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">四、信息共享</h2>
      <p>除法律法规要求或经您同意外，本站不会向第三方出售或出租您的个人信息。</p>
      <h2 className="text-amber-300 font-serif text-base pt-2">五、您的权利</h2>
      <p>您可随时清除浏览器本地存储以删除本地记录。如有隐私相关疑问，请通过本站提供的联系方式与我们联系。</p>
    </LegalDoc>
  );
}
