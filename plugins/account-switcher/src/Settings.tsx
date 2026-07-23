import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { showToast } from "@vendetta/ui/toasts";
import { Forms } from "@vendetta/ui/components";

const { FormSection, FormRow, FormText } = Forms;

if (!storage.accounts) storage.accounts = [];

function getUser() {
    return findByProps("getCurrentUser")?.getCurrentUser();
}
function getToken() {
    return findByProps("getToken")?.getToken();
}
function switchAccountToken(token: string) {
    return findByProps("loginToken")?.switchAccountToken(token);
}

function saveCurrentAccount() {
    const user = getUser();
    const token = getToken();
    if (!user || !token) {
        showToast("Не удалось получить данные аккаунта");
        return;
    }
    const accounts = (storage.accounts as any[]).filter((a) => a.id !== user.id);
    accounts.push({ id: user.id, username: user.username, token });
    storage.accounts = accounts;
    showToast(`Сохранён аккаунт: ${user.username}`);
}

function switchTo(token: string, username: string) {
    try {
        switchAccountToken(token);
        showToast(`Переключаюсь на ${username}...`);
    } catch (e) {
        showToast("Ошибка: " + e.message);
    }
}

function removeAccount(id: string) {
    storage.accounts = (storage.accounts as any[]).filter((a) => a.id !== id);
}
export default function Settings() {
    const currentId = getUser()?.id;
    const accounts = storage.accounts as any[];

    return (
        <>
            <FormSection title="Сохранённые аккаунты">
                {accounts.length === 0 && <FormText>Пока пусто</FormText>}
                {accounts.map((acc) => (
                    <FormRow
                        key={acc.id}
                        label={acc.username + (acc.id === currentId ? " ✓" : "")}
                        subLabel={acc.id === currentId ? "Текущий аккаунт" : "Нажми, чтобы переключиться · долгое нажатие — удалить"}
                        onPress={() => switchTo(acc.token, acc.username)}
                        onLongPress={() => removeAccount(acc.id)}
                    />
                ))}
            </FormSection>
            <FormSection title="Действия">
                <FormRow
                    label="Сохранить текущий аккаунт"
                    subLabel="Добавит аккаунт, под которым ты сейчас вошёл"
                    onPress={saveCurrentAccount}
                />
            </FormSection>
        </>
    );
}