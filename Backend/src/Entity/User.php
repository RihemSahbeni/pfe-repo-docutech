<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["post:read","projects"])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(["post:read","projects"])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(["post:read","projects"])]
    private array $roles = [];
    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","projects"])]
    private $status = null;
    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(["post:read","projects"])]
    private ?string $password = null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","projects"])]
    private $resetToken= null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","projects"])]
    private ?string $firstname  = null;
    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","projects"])]
    private ?string $lastname  = null;
    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","projects"])]
    private ?string $phoneNumber  = null;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(["post:read","projects"])]
    private $VerificationCode= null;

    #[ORM\OneToMany(mappedBy: 'Creator', targetEntity: Project::class, orphanRemoval:true)]
    #[Groups(["post:read","projects"])]
    #[Exclude]
    private Collection $ProjectCreated;

    #[ORM\ManyToMany(targetEntity: Project::class, mappedBy: 'PUsers')]
    #[ORM\JoinTable(name: 'project_user')]
    private Collection $PorjectAffected;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: History::class)]
    private Collection $histories;




    public function __construct()
    {

        $this->ProjectCreated = new ArrayCollection();
        $this->PorjectAffected = new ArrayCollection();
        $this->histories = new ArrayCollection();

    }

    

   

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }


    /**
     * @return string|null
     */
    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    /**
     * @param string|null $firstname
     */
    public function setFirstname(?string $firstname): void
    {
        $this->firstname = $firstname;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        
        // Il est obligatoire d'avoir au moins un rôle
        if (empty($roles)) {
            $roles[] = 'Utilisateur';
        }

        // garantir que chaque rôle est unique
        return array_unique($roles);
        // guarantee every user at least has ROLE_USER
       // $roles[] = 'ROLE_USER';

       // return array_unique($roles);
    }
   /* public function getUserData(Security $security): array
    {
        $user = $security->getUser();

        return [
            'id' => $user->getId(),
            'firstname' => $user->getFirstName(),
            'lastname' => $user->getLastName(),
        ];
    }*/
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
    public function getResetToken(): string
{
    return $this->resetToken;
}

public function setResetToken(string $resetToken): self
{
    $this->resetToken = $resetToken;

    return $this;
}

    /**
     * @return string|null
     */
    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    /**
     * @param string|null $lastname
     */
    public function setLastname(?string $lastname): void
    {
        $this->lastname = $lastname;
    }

    /**
     * @return string|null
     */
    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    /**
     * @param string|null $phoneNumber
     */
    public function setPhoneNumber(?string $phoneNumber): void
    {
        $this->phoneNumber = $phoneNumber;
    }
    /**
     * @return null
     */
    public function getVerificationCode()
    {
        return $this->VerificationCode;
    }

    /**
     * @param null $VerificationCode
     */
    public function setVerificationCode($VerificationCode): void
    {
        $this->VerificationCode = $VerificationCode;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getProjectCreated(): Collection
    {
        return $this->ProjectCreated;
    }

    public function addProjectCreated(Project $projectCreated): self
    {
        if (!$this->ProjectCreated->contains($projectCreated)) {
            $this->ProjectCreated->add($projectCreated);
            $projectCreated->setCreator($this);
        }

        return $this;
    }

    public function removeProjectCreated(Project $projectCreated): self
    {
        if ($this->ProjectCreated->removeElement($projectCreated)) {
            // set the owning side to null (unless already changed)
            if ($projectCreated->getCreator() === $this) {
                $projectCreated->setCreator(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getPorjectAffected(): Collection
    {
        return $this->PorjectAffected;
    }

    public function addPorjectAffected(Project $porjectAffected): self
    {
        if (!$this->PorjectAffected->contains($porjectAffected)) {
            $this->PorjectAffected->add($porjectAffected);
            $porjectAffected->addPUser($this);
        }

        return $this;
    }

    public function removePorjectAffected(Project $porjectAffected): self
    {
        if ($this->PorjectAffected->removeElement($porjectAffected)) {
            $porjectAffected->removePUser($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, History>
     */
    public function getHistories(): Collection
    {
        return $this->histories;
    }

    public function addHistory(History $history): self
    {
        if (!$this->histories->contains($history)) {
            $this->histories->add($history);
            $history->setUser($this);
        }

        return $this;
    }

    public function removeHistory(History $history): self
    {
        if ($this->histories->removeElement($history)) {
            // set the owning side to null (unless already changed)
            if ($history->getUser() === $this) {
                $history->setUser(null);
            }
        }

        return $this;
    }





}
