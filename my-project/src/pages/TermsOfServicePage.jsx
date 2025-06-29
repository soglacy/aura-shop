// src/pages/TermsOfServicePage.jsx
import React from 'react';
import PageHeader from '../components/common/PageHeader';

const TermsOfServicePage = () => {
    return (
        <div className="bg-brand-bg-dark text-white min-h-screen">
            <PageHeader
                title="Условия Использования"
                subText="Правила и условия, регулирующие использование нашего сайта и услуг."
                breadcrumbs={[
                    { label: 'Главная', path: '/' },
                    { label: 'Условия Использования' }
                ]}
            />
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto bg-brand-bg-black p-6 md:p-8 rounded-lg shadow-xl">
                     <div className="prose prose-lg prose-invert max-w-none text-gray-300 prose-headings:text-white prose-a:text-brand-blue hover:prose-a:text-blue-400 prose-strong:text-white">
                        
                        <h2>1. Термины и определения</h2>
                        <p><strong>Сайт</strong> — интернет-магазин Aura Shop, расположенный в сети Интернет по адресу [Ваш домен].</p>
                        <p><strong>Пользователь</strong> — любое физическое или юридическое лицо, использующее Сайт.</p>
                        <p><strong>Товар</strong> — продукция, представленная к продаже на Сайте.</p>

                        <h2>2. Предмет соглашения</h2>
                        <p>Настоящие Условия представляют собой публичную оферту. Используя материалы и функции Сайта, Пользователь считается присоединившимся к настоящим Условиям.</p>
                        <p>Администрация Сайта вправе в любое время в одностороннем порядке изменять условия настоящего Соглашения. Такие изменения вступают в силу по истечении 3 (трех) дней с момента размещения новой версии Соглашения на сайте.</p>

                        <h2>3. Обязательства Пользователя</h2>
                        <p>Пользователь соглашается не предпринимать действий, которые могут рассматриваться как нарушающие российское законодательство или нормы международного права, в том числе в сфере интеллектуальной собственности, авторских и/или смежных правах, а также любых действий, которые приводят или могут привести к нарушению нормальной работы Сайта и сервисов Сайта.</p>
                        <p>Пользователь несет полную ответственность за достоверность данных, указанных им при регистрации на Сайте и/или оформлении Заказа.</p>
                        
                        <h2>4. Оформление заказа и возврат товара</h2>
                        <p>Информация о Товарах, их ценах, способах и сроках оплаты и доставки является публичной офертой.</p>
                        <p>Возврат Товара надлежащего качества возможен в случае, если сохранены его товарный вид, потребительские свойства, а также документ, подтверждающий факт и условия покупки указанного Товара, в течение 14 (четырнадцати) дней с момента передачи Товара Покупателю.</p>
                        <p>В случае обнаружения в Товаре недостатков, если они не были оговорены Продавцом, Покупатель по своему выбору вправе потребовать замены на товар этой же марки, замены на такой же товар другой марки с соответствующим перерасчетом покупной цены, соразмерного уменьшения покупной цены или незамедлительного безвозмездного устранения недостатков товара.</p>

                        <h2>5. Ограничение ответственности</h2>
                        <p>Администрация Сайта не несет ответственности за любые ошибки, упущения, прерывания, дефекты и задержки в обработке или передаче данных, сбои в линиях связи и другие технические сбои.</p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;